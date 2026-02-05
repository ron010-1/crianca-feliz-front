import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCamera, FaUserEdit } from "react-icons/fa";
import { MdCloudUpload, MdDelete, MdOutlineClose, MdSearch } from "react-icons/md";

import Style from "./style.module.css";

import Input from "../Input/Input";
import Button from "../button/Button";
import CustomTable from "../custom-table/CustomTable";
import ConfirmModal from "../confirm-modal/ConfirmModal";
import GaleriaModal from "../galeria-modal/GaleriaModal";
import Loading from "../loading/Loading";
import Pagination from "../pagination/Pagination";
import Empty from "../empty/Empty";

import { useTabelaVisitas } from "./use-tabela-visitas";
import type { VisitaType } from "../../models/visita";
import type { PaginationType } from "../../models/global";
import type { BeneficiarioType } from "../../models/beneficiario";

import { uploadToCloudinary } from "../../api/uploads/cloudinaryUpload";
import { useIsOnline } from "../../hooks/useIsOnline"; // Importação do seu hook

const visitaSchema = z.object({
  beneficiarioId: z.string().min(1, "O beneficiário é obrigatório."),
  data: z.string().min(1, "A data é obrigatória."),
  acompanhamento_familiar: z.string().trim().min(1, "O acompanhamento familiar é obrigatório."),
  estimulo_familiar: z.string().trim().min(1, "O estímulo familiar é obrigatório."),
  evolucao: z.string().trim().min(1, "A evolução é obrigatória."),
});

type VisitaFormData = z.infer<typeof visitaSchema>;

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });

const getBeneficiarioId = (b: BeneficiarioType): string => {
  const anyB = b as any;
  return String(anyB.uuid ?? anyB.id ?? "");
};

const getBeneficiarioNome = (b: BeneficiarioType): string => {
  const anyB = b as any;
  return String(anyB.nome ?? "");
};

const formatDateForDisplay = (value?: string) => {
  if (!value) return "-";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "-";
  const d = String(dt.getDate()).padStart(2, "0");
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const y = dt.getFullYear();
  return `${d}/${m}/${y}`;
};

const TabelaVisitas = () => {
  const isOnline = useIsOnline(); // Instância do status de conexão
  
  const {
    visitas,
    beneficiariosLista,
    isLoadingVisitas,
    isSuccessVisitas,
    isSaving,
    isDeleting,
    modalFormOpen,
    setModalFormOpen,
    modalDeleteOpen,
    setModalDeleteOpen,
    modalGaleriaOpen,
    setModalGaleriaOpen,
    visitaSelecionada,
    handleNovo,
    handleEditar,
    handleDeletarClick,
    handleVerFotos,
    handleSalvar,
    handleConfirmarDelecao,
  } = useTabelaVisitas();

  const [busca, setBusca] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredBeneficiarios, setFilteredBeneficiarios] = useState<BeneficiarioType[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [previewFotos, setPreviewFotos] = useState<string[]>([]);
  const [urlsExistentes, setUrlsExistentes] = useState<string[]>([]);
  const [novosArquivos, setNovosArquivos] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getBeneficiarioDisplayNameById = (id?: string) => {
    const raw = String(id || "").trim();
    if (!raw) return "-";
    const list = (beneficiariosLista || []) as BeneficiarioType[];
    const found = list.find((b) => getBeneficiarioId(b) === raw);
    const nome = found ? getBeneficiarioNome(found) : "";
    return nome && nome.trim() ? nome : "-";
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VisitaFormData>({
    resolver: zodResolver(visitaSchema),
    defaultValues: {
      beneficiarioId: "",
      data: "",
      acompanhamento_familiar: "",
      estimulo_familiar: "",
      evolucao: "",
    },
  });

  useEffect(() => {
    if (modalFormOpen) {
      if (visitaSelecionada) {
        setValue("beneficiarioId", visitaSelecionada.beneficiarioId || "");
        setValue("data", visitaSelecionada.data || "");
        setValue("acompanhamento_familiar", visitaSelecionada.acompanhamento_familiar || "");
        setValue("estimulo_familiar", visitaSelecionada.estimulo_familiar || "");
        setValue("evolucao", visitaSelecionada.evolucao || "");

        const existentes = (visitaSelecionada.fotos || []).filter(Boolean);
        setUrlsExistentes(existentes);
        setPreviewFotos(existentes);
        setNovosArquivos([]);
        setSearchTerm(
          (visitaSelecionada.beneficiarioNome || getBeneficiarioDisplayNameById(visitaSelecionada.beneficiarioId)) === "-"
            ? ""
            : (visitaSelecionada.beneficiarioNome || getBeneficiarioDisplayNameById(visitaSelecionada.beneficiarioId))
        );
      } else {
        reset({
          beneficiarioId: "",
          data: "",
          acompanhamento_familiar: "",
          estimulo_familiar: "",
          evolucao: "",
        });
        setSearchTerm("");
        setUrlsExistentes([]);
        setPreviewFotos([]);
        setNovosArquivos([]);
      }
      setIsSearching(false);
    }
  }, [modalFormOpen, visitaSelecionada, reset, setValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const list = (beneficiariosLista || []) as BeneficiarioType[];
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredBeneficiarios(list);
      return;
    }
    setFilteredBeneficiarios(list.filter((b) => getBeneficiarioNome(b).toLowerCase().includes(term)));
  }, [searchTerm, beneficiariosLista]);

  const visitasFiltradasTotal = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return (visitas || []).filter((v: VisitaType) =>
      (v.beneficiarioNome || getBeneficiarioDisplayNameById(v.beneficiarioId)).toLowerCase().includes(q)
    );
  }, [visitas, busca, beneficiariosLista]);

  useEffect(() => {
    setCurrentPage(1);
  }, [busca]);

  const visitasPaginadas = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return visitasFiltradasTotal.slice(startIndex, endIndex);
  }, [visitasFiltradasTotal, currentPage]);

  const paginationInfo: PaginationType = useMemo(
    () => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      totalItens: visitasFiltradasTotal.length,
    }),
    [currentPage, visitasFiltradasTotal.length]
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSelectBeneficiario = (beneficiario: BeneficiarioType) => {
    const id = getBeneficiarioId(beneficiario);
    setValue("beneficiarioId", id, { shouldValidate: true, shouldDirty: true });
    setSearchTerm(getBeneficiarioNome(beneficiario));
    setIsSearching(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const dataUrls = await Promise.all(files.map(fileToDataUrl));
    setNovosArquivos((prev) => [...prev, ...files]);
    setPreviewFotos((prev) => [...prev, ...dataUrls]);
    e.target.value = "";
  };

  const removeFoto = (index: number) => {
    setPreviewFotos((prev) => prev.filter((_, i) => i !== index));
    const existentesCount = urlsExistentes.length;
    if (index < existentesCount) {
      setUrlsExistentes((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    const fileIndex = index - existentesCount;
    setNovosArquivos((prev) => prev.filter((_, i) => i !== fileIndex));
  };

  const onSubmit = async (values: VisitaFormData) => {
    try {
      setIsUploading(true);
      const urlsNovas = await Promise.all(novosArquivos.map((f) => uploadToCloudinary(f)));
      const imagens = [...urlsExistentes, ...urlsNovas].filter(Boolean);

      const payload: Partial<VisitaType> = {
        beneficiarioId: values.beneficiarioId,
        data: values.data,
        acompanhamento_familiar: values.acompanhamento_familiar,
        estimulo_familiar: values.estimulo_familiar,
        evolucao: values.evolucao,
        fotos: imagens,
      };

      await handleSalvar(payload);
      setModalFormOpen(false);
    } finally {
      setIsUploading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "Data",
        accessor: (row: VisitaType) => formatDateForDisplay(row.data),
      },
      {
        name: "Beneficiário",
        accessor: (row: VisitaType) => row.beneficiarioNome || getBeneficiarioDisplayNameById(row.beneficiarioId),
      },
      {
        name: "Evolução",
        accessor: (row: VisitaType) => row.evolucao,
      },
      {
        name: "Acompanhamento",
        accessor: (row: VisitaType) => row.acompanhamento_familiar,
      },
      {
        name: "Estímulo",
        accessor: (row: VisitaType) => row.estimulo_familiar,
      },
      {
        name: "Ações",
        accessor: (row: VisitaType) => (
          <div className={`${Style.actionsTable} ${!isOnline ? Style.disabledActions : ""}`}>
            <FaCamera
              className={`${Style.iconActions} ${Style.iconCamera}`}
              role="button"
              title={isOnline ? "Ver fotos" : "Offline"}
              onClick={() => isOnline && handleVerFotos(row)}
            />
            <FaUserEdit
              className={`${Style.iconActions} ${Style.iconEdit}`}
              title={isOnline ? "Editar visita" : "Offline"}
              role="button"
              onClick={() => isOnline && handleEditar(row)}
            />
            <MdDelete
              className={`${Style.iconActions} ${Style.iconDelete}`}
              title={isOnline ? "Deletar visita" : "Offline"}
              role="button"
              onClick={() => isOnline && handleDeletarClick(row)}
            />
          </div>
        ),
      },
    ],
    [beneficiariosLista, isOnline] // Dependência isOnline adicionada aqui
  );

  const tituloGaleria = useMemo(() => {
    const t =
      visitaSelecionada?.beneficiarioNome ||
      getBeneficiarioDisplayNameById(visitaSelecionada?.beneficiarioId) ||
      "-";
    const clean = String(t || "").trim();
    return clean ? clean : "-";
  }, [visitaSelecionada, beneficiariosLista]);

  if (isLoadingVisitas) {
    return <Loading />;
  }

  if (!isSuccessVisitas) {
    return <p>Erro ao carregar visitas!</p>;
  }

  return (
    <div className={Style.containerListagem}>
      <section className={Style.headerVisitas}>
        <h2>Visitas</h2>
        <Button 
          label="Nova Visita" 
          variant="primary" 
          onClick={handleNovo} 
          disabled={!isOnline}
          title={!isOnline ? "Funcionalidade indisponível offline" : ""}
        />
      </section>

      <div className={Style.filtersContainer}>
        <div className={Style.searchWrapper}>
          <Input
            placeholder="Buscar por beneficiário..."
            value={busca}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusca(e.target.value)}
          />
          <MdSearch className={Style.searchIcon} />
        </div>
      </div>

      {visitasFiltradasTotal.length === 0 ? (
        <Empty />
      ) : (
        <>
          <CustomTable data={visitasPaginadas} columns={columns} />
          <div className={Style.sectionPagination}>
            <Pagination pagination={paginationInfo} onPageChange={handlePageChange} />
          </div>
        </>
      )}

      {modalFormOpen && (
        <div className={Style.backdrop} onClick={() => setModalFormOpen(false)}>
          <div className={Style.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={Style.modalHeader}>
              <span className={Style.modalTitle}>{visitaSelecionada ? "Editar Visita" : "Nova Visita"}</span>
              <MdOutlineClose onClick={() => setModalFormOpen(false)} className={Style.iconClose} title="Fechar" role="button" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={Style.modalBody}>
                <div className={Style.field}>
                  <label>Beneficiário</label>
                  <div className={Style.searchBeneficiario} ref={searchContainerRef}>
                    <Input
                      placeholder="Buscar beneficiário..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSearchTerm(e.target.value);
                        setIsSearching(true);
                      }}
                      onFocus={() => setIsSearching(true)}
                    />
                    {isSearching && (
                      <div className={Style.dropdownBeneficiarios}>
                        {filteredBeneficiarios.length ? (
                          filteredBeneficiarios.map((b) => (
                            <div
                              key={getBeneficiarioId(b)}
                              className={Style.dropdownItem}
                              onClick={() => handleSelectBeneficiario(b)}
                              role="button"
                            >
                              {getBeneficiarioNome(b)}
                            </div>
                          ))
                        ) : (
                          <div className={Style.dropdownEmpty}>Nenhum beneficiário encontrado</div>
                        )}
                      </div>
                    )}
                  </div>
                  <input type="hidden" {...register("beneficiarioId")} />
                  {errors.beneficiarioId && <span className={Style.errorText}>{errors.beneficiarioId.message}</span>}
                </div>

                <div className={Style.field}>
                  <label>Data</label>
                  <Input type="date" {...register("data")} />
                  {errors.data && <span className={Style.errorText}>{errors.data.message}</span>}
                </div>

                <div className={Style.field}>
                  <label>Evolução</label>
                  <textarea className={Style.textarea} {...register("evolucao")} />
                  {errors.evolucao && <span className={Style.errorText}>{errors.evolucao.message}</span>}
                </div>

                <div className={Style.field}>
                  <label>Acompanhamento familiar</label>
                  <textarea className={Style.textarea} {...register("acompanhamento_familiar")} />
                  {errors.acompanhamento_familiar && (
                    <span className={Style.errorText}>{errors.acompanhamento_familiar.message}</span>
                  )}
                </div>

                <div className={Style.field}>
                  <label>Estímulo familiar</label>
                  <textarea className={Style.textarea} {...register("estimulo_familiar")} />
                  {errors.estimulo_familiar && <span className={Style.errorText}>{errors.estimulo_familiar.message}</span>}
                </div>

                <div className={Style.field}>
                  <label>Fotos da Visita</label>
                  {/* Desabilita upload se estiver offline pois depende do Cloudinary */}
                  <label className={`${Style.uploadBox} ${!isOnline ? Style.disabledUpload : ""}`}>
                    <MdCloudUpload size={28} />
                    <span>{isOnline ? "Clique para adicionar fotos" : "Upload indisponível (Offline)"}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleFileChange} 
                      className={Style.fileInput} 
                      disabled={!isOnline}
                    />
                  </label>

                  {previewFotos.length > 0 && (
                    <div className={Style.previewContainer}>
                      {previewFotos.map((src, idx) => (
                        <div key={`${src}-${idx}`} className={Style.previewItem}>
                          <img src={src} alt={`preview-${idx}`} />
                          <button type="button" className={Style.removeBtn} onClick={() => removeFoto(idx)}>
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={Style.modalFooter}>
                <Button label="Cancelar" variant="secondary" onClick={() => setModalFormOpen(false)} />
                <Button
                  label={isUploading || isSaving ? <Loading size="sm" withMessage={false} /> : "Salvar"}
                  variant="primary"
                  type="submit"
                  disabled={isUploading || isSaving || !isOnline}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={modalDeleteOpen}
        onClose={() => setModalDeleteOpen(false)}
        onAction={handleConfirmarDelecao}
        message={
          <span>
            Tem certeza que deseja remover a visita de{" "}
            <strong>
              {visitaSelecionada?.beneficiarioNome ||
                getBeneficiarioDisplayNameById(visitaSelecionada?.beneficiarioId) ||
                "-"}
            </strong>
            ?
          </span>
        }
        type="danger"
        loading={isDeleting}
      />

      <GaleriaModal
        open={modalGaleriaOpen}
        onClose={() => setModalGaleriaOpen(false)}
        fotos={visitaSelecionada?.fotos || []}
        titulo={tituloGaleria}
      />
    </div>
  );
};

export default TabelaVisitas;