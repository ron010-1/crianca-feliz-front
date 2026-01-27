import { useEffect, useMemo, useRef, useState } from "react";
import { FaCamera, FaUserEdit } from "react-icons/fa";
import { MdCloudUpload, MdDelete, MdOutlineClose, MdSearch } from "react-icons/md";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../Input/Input";
import Button from "../button/Button";
import CustomTable from "../custom-table/CustomTable";
import ConfirmModal from "../confirm-modal/ConfirmModal";
import GaleriaModal from "../galeria-modal/GaleriaModal";
import Loading from "../loading/Loading";
import Pagination from "../pagination/Pagination";
import Empty from "../empty/Empty";

import Style from "./style.module.css";
import { useTabelaVisitas } from "./use-tabela-visitas";
import type { VisitaType } from "../../models/visita";
import type { PaginationType } from "../../models/global";
import type { BeneficiarioType } from "../../models/beneficiario";

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
  const d = new Date(value.includes("T") ? value : `${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

const TabelaVisitas = () => {
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

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
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

  const beneficiarioIdSelecionado = useWatch({ control, name: "beneficiarioId" });

  const getBeneficiarioNomeById = (beneficiarioId?: string) => {
    if (!beneficiarioId) return "-";
    const list = (beneficiariosLista || []) as BeneficiarioType[];
    const found = list.find((b) => getBeneficiarioId(b) === String(beneficiarioId));
    return found ? getBeneficiarioNome(found) : "-";
  };

  useEffect(() => {
    if (!modalFormOpen) return;

    if (visitaSelecionada) {
      reset({
        beneficiarioId: String(visitaSelecionada.beneficiarioId || ""),
        data: visitaSelecionada.data || "",
        acompanhamento_familiar: visitaSelecionada.acompanhamento_familiar || "",
        estimulo_familiar: visitaSelecionada.estimulo_familiar || "",
        evolucao: visitaSelecionada.evolucao || "",
      });

      setSearchTerm(
        visitaSelecionada.beneficiarioNome ||
          getBeneficiarioNomeById(visitaSelecionada.beneficiarioId)
      );

      setPreviewFotos(visitaSelecionada.fotos || []);
    } else {
      reset({
        beneficiarioId: "",
        data: "",
        acompanhamento_familiar: "",
        estimulo_familiar: "",
        evolucao: "",
      });

      setSearchTerm("");
      setPreviewFotos([]);
    }

    setIsSearching(false);
  }, [modalFormOpen, visitaSelecionada, reset]);

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
    return (visitas || []).filter((v) =>
      (v.beneficiarioNome || getBeneficiarioNomeById(v.beneficiarioId)).toLowerCase().includes(q)
    );
  }, [visitas, busca]);

  useEffect(() => {
    setCurrentPage(1);
  }, [busca]);

  const visitasPaginadas = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return visitasFiltradasTotal.slice(startIndex, endIndex);
  }, [visitasFiltradasTotal, currentPage]);

  const paginationInfo: PaginationType = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    totalItens: visitasFiltradasTotal.length,
  };

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

    setPreviewFotos((prev) => [...prev, ...dataUrls]);

    e.target.value = "";
  };

  const removeFoto = (index: number) => {
    setPreviewFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: VisitaFormData) => {
    const payload: Omit<VisitaType, "id"> = {
      data: data.data,
      beneficiarioId: data.beneficiarioId,
      beneficiarioNome: getBeneficiarioNomeById(data.beneficiarioId),
      evolucao: data.evolucao,
      acompanhamento_familiar: data.acompanhamento_familiar,
      estimulo_familiar: data.estimulo_familiar,
      fotos: [],
    };

    handleSalvar(payload);
  };

  const columns = [
    { name: "Data", accessor: (row: VisitaType) => formatDateForDisplay(row.data) },
    {
      name: "Beneficiário",
      accessor: (row: VisitaType) =>
        row.beneficiarioNome || getBeneficiarioNomeById(row.beneficiarioId),
    },
    { name: "Evolução", accessor: (row: VisitaType) => row.evolucao || "-" },
    { name: "Acompanhamento", accessor: (row: VisitaType) => row.acompanhamento_familiar || "-" },
    { name: "Estímulo", accessor: (row: VisitaType) => row.estimulo_familiar || "-" },
    {
      name: "Ações",
      accessor: (row: VisitaType) => (
        <div className={Style.actionsTable}>
          <FaCamera className={`${Style.iconActions} ${Style.iconCamera}`} role="button" onClick={() => handleVerFotos(row)} />
          <FaUserEdit className={`${Style.iconActions} ${Style.iconEdit}`} role="button" onClick={() => handleEditar(row)} />
          <MdDelete className={`${Style.iconActions} ${Style.iconDelete}`} role="button" onClick={() => handleDeletarClick(row)} />
        </div>
      ),
    },
  ];

  if (isLoadingVisitas) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem", width: "100%" }}>
        <Loading message="Carregando visitas..." size="lg" />
      </div>
    );
  }

  if (!isSuccessVisitas && !isLoadingVisitas) {
    return <p>Erro ao carregar visitas!</p>;
  }

  return (
    <div className={Style.containerListagem}>
      <section className={Style.headerVisitas}>
        <h2>Visitas</h2>
        <Button label="Nova Visita" variant="primary" onClick={handleNovo} />
      </section>

      <div className={Style.filtersContainer}>
        <div className={Style.searchWrapper}>
          <Input placeholder="Buscar por beneficiário..." value={busca} onChange={(e) => setBusca((e.target as HTMLInputElement).value)} />
        </div>
      </div>

      {visitas.length === 0 ? (
        <Empty />
      ) : (
        <>
          <CustomTable columns={columns} data={visitasPaginadas} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
            <Pagination pagination={paginationInfo} onPageChange={handlePageChange} />
          </div>
        </>
      )}

      {modalFormOpen && (
        <div className={Style.backdrop}>
          <div className={Style.modalContainer}>
            <div className={Style.modalHeader}>
              <h3 className={Style.modalTitle}>{visitaSelecionada ? "Editar Visita" : "Agendar Nova Visita"}</h3>
              <MdOutlineClose onClick={() => setModalFormOpen(false)} className={Style.closeIcon} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={Style.modalBody}>
                <div className={Style.formGroup} ref={searchContainerRef}>
                  <label className={Style.formLabel}>Beneficiário</label>

                  <div className={Style.searchInputWrapper}>
                    <input
                      type="text"
                      className={`${Style.formInputSearch} ${errors.beneficiarioId ? Style.inputError : ""}`}
                      placeholder="Pesquisar beneficiário..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsSearching(true);
                        if (e.target.value.trim() === "") {
                          setValue("beneficiarioId", "", { shouldValidate: true, shouldDirty: true });
                        }
                      }}
                      onFocus={() => setIsSearching(true)}
                    />
                    <MdSearch className={Style.searchIcon} />
                  </div>

                  <input type="hidden" {...register("beneficiarioId")} />

                  {errors.beneficiarioId?.message && (
                    <span className={Style.errorText}>{errors.beneficiarioId.message}</span>
                  )}

                  {isSearching && (
                    <div className={Style.searchResultsDropdown}>
                      {filteredBeneficiarios.length > 0 ? (
                        filteredBeneficiarios.map((b) => {
                          const id = getBeneficiarioId(b);
                          const selected = String(id) === String(beneficiarioIdSelecionado || "");
                          return (
                            <div
                              key={id}
                              className={`${Style.searchResultItem} ${selected ? Style.selected : ""}`}
                              onClick={() => handleSelectBeneficiario(b)}
                            >
                              {getBeneficiarioNome(b)}
                            </div>
                          );
                        })
                      ) : (
                        <div className={Style.searchResultEmpty}>Nenhum beneficiário encontrado</div>
                      )}
                    </div>
                  )}
                </div>

                <div className={Style.formRow}>
                  <div className={Style.formGroup}>
                    <label className={Style.formLabel}>Data</label>
                    <Input type="date" {...register("data")} />
                    {errors.data?.message && <span className={Style.errorText}>{errors.data.message}</span>}
                  </div>
                </div>

                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>Acompanhamento Familiar</label>
                  <textarea className={`${Style.formTextarea} ${errors.acompanhamento_familiar ? Style.inputError : ""}`} rows={2} {...register("acompanhamento_familiar")} />
                  {errors.acompanhamento_familiar?.message && <span className={Style.errorText}>{errors.acompanhamento_familiar.message}</span>}
                </div>

                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>Estímulo Familiar</label>
                  <textarea className={`${Style.formTextarea} ${errors.estimulo_familiar ? Style.inputError : ""}`} rows={2} {...register("estimulo_familiar")} />
                  {errors.estimulo_familiar?.message && <span className={Style.errorText}>{errors.estimulo_familiar.message}</span>}
                </div>

                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>Evolução</label>
                  <textarea className={`${Style.formTextarea} ${errors.evolucao ? Style.inputError : ""}`} rows={3} {...register("evolucao")} />
                  {errors.evolucao?.message && <span className={Style.errorText}>{errors.evolucao.message}</span>}
                </div>

                <div className={Style.formGroup}>
                  <label className={Style.formLabel}>Fotos da Visita (prévia)</label>

                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                      className={Style.hiddenInput}
                    />
                    <label htmlFor="file-upload" className={Style.uploadLabel}>
                      <MdCloudUpload size={24} />
                      <span>Clique para adicionar fotos</span>
                    </label>
                  </div>

                  {previewFotos.length > 0 && (
                    <div className={Style.previewContainer}>
                      {previewFotos.map((foto, index) => (
                        <div key={index} className={Style.previewItem}>
                          <img src={foto} alt={`Preview ${index}`} />
                          <button type="button" className={Style.removeBtn} onClick={() => removeFoto(index)}>
                            <MdDelete />
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
                  label={isSaving ? <Loading size="sm" withMessage={false} /> : "Salvar"}
                  variant="primary"
                  type="submit"
                  disabled={isSaving}
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
            <strong>{visitaSelecionada?.beneficiarioNome || getBeneficiarioNomeById(visitaSelecionada?.beneficiarioId)}</strong>?
          </span>
        }
        type="danger"
        loading={isDeleting}
      />

      <GaleriaModal
        open={modalGaleriaOpen}
        onClose={() => setModalGaleriaOpen(false)}
        fotos={visitaSelecionada?.fotos || []}
        titulo={visitaSelecionada?.beneficiarioNome || getBeneficiarioNomeById(visitaSelecionada?.beneficiarioId)}
      />
    </div>
  );
};

export default TabelaVisitas;
