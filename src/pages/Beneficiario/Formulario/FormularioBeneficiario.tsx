import Button from "../../../components/button/Button";
import StylesPage from "./styles.module.css";
import Input from "../../../components/Input/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { cadastrarBeneficiarioSchema, type cadastrarBeneficiarioType } from "./schemaValidarForm";
import SearchLocationMap from "../../../components/search-location-map/SearchLocationMap";
import type { BeneficiarioType } from "../../../models/beneficiario";
import Loading from "../../../components/loading/Loading";
import { useEffect, useMemo } from "react";

interface FormularioBeneficiarioProps {
  isEdit?: boolean;
  beneficiario?: BeneficiarioType;
  loading: boolean;
  onAction: (data: cadastrarBeneficiarioType) => void;
}

const FormularioBeneficiario = ({ isEdit = false, beneficiario, onAction, loading }: FormularioBeneficiarioProps) => {
  const deafaultValuesForm = useMemo(() => {
    if (isEdit && beneficiario) {
      const [lon, lat] = beneficiario.location.coordinates;

      return {
        nome: beneficiario.nome,
        nome_responsavel: beneficiario.nome_responsavel,
        data_nascimento: beneficiario.data_nascimento,
        phone1: beneficiario.phone1,
        phone2: beneficiario.phone2 || undefined,
        location: {
          type: "Point",
          coordinates: [lat, lon],
        },
      };
    }
    return { location: { type: "Point", coordinates: [] } };
  }, [isEdit, beneficiario]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<cadastrarBeneficiarioType>({
    resolver: zodResolver(cadastrarBeneficiarioSchema),
    defaultValues: deafaultValuesForm,
  });

  useEffect(() => {
    if (isEdit && beneficiario) {
      reset(deafaultValuesForm);
    }
  }, [beneficiario, isEdit, reset, deafaultValuesForm]);

  const location = useWatch({
    control,
    name: "location",
  });

  const sizeInput = "lg";

  const onSubmit = (data: cadastrarBeneficiarioType) => {
    if (isEdit && !isDirty) return;

    onAction(data);
  };

  return (
    <form className={StylesPage.form} onSubmit={handleSubmit(onSubmit)}>
      <section className={StylesPage.containerFormData}>
        <section className={StylesPage.inputGroup}>
          <div>
            <Input
              {...register("nome")}
              placeholder="Digite aqui.."
              autoComplete="name"
              label="Nome do beneficiário*"
              tamanho={sizeInput}
            />
            {errors.nome && <span className={StylesPage.formError}>{errors.nome.message}</span>}
          </div>

          <div>
            <Input
              label="Nome do Responsável*"
              placeholder="Digite aqui.."
              {...register("nome_responsavel")}
              autoComplete="additional-name"
              tamanho={sizeInput}
            />
            {errors.nome_responsavel && <span className={StylesPage.formError}>{errors.nome_responsavel.message}</span>}
          </div>

          <div>
            <Input
              {...register("data_nascimento")}
              type="date"
              max={new Date().toISOString().split("T")[0]}
              autoComplete="bday"
              label="Data de nascimento*"
              tamanho={sizeInput}
            />
            {errors.data_nascimento && <span className={StylesPage.formError}>{errors.data_nascimento.message}</span>}
          </div>
        </section>

        <section className={StylesPage.inputGroup}>
          <div>
            <Input
              {...register("phone1")}
              label="Telefone 1*"
              placeholder="Digite aqui.."
              type="tel"
              autoComplete="tel"
              tamanho={sizeInput}
            />
            {errors.phone1 && <span className={StylesPage.formError}>{errors.phone1.message}</span>}
          </div>

          <div>
            <Input
              {...register("phone2")}
              label="Telefone 2"
              placeholder="Digite aqui.."
              type="tel"
              autoComplete="tel"
              tamanho={sizeInput}
            />
            {errors.phone2 && <span className={StylesPage.formError}>{errors.phone2.message}</span>}
          </div>
        </section>
      </section>

      <section className={StylesPage.locationForm}>
        <h3>Localização do beneficiário*</h3>

        <div>
          <SearchLocationMap
            coords={location.coordinates}
            onSelectLocation={(novasCoords) =>
              setValue("location.coordinates", novasCoords, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          {errors.location?.coordinates && (
            <span className={StylesPage.formError}>{errors.location.coordinates.message}</span>
          )}
        </div>
      </section>

      <Button
        label={loading ? <Loading size="sm" withMessage={false} /> : `${isEdit ? "Editar" : "Cadastrar"} beneficiário`}
        type="submit"
        disabled={isEdit ? !isDirty : !isValid}
      />
    </form>
  );
};

export default FormularioBeneficiario;
