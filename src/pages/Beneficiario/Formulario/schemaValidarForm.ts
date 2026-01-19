import z from "zod";

const phoneSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, ""))
  .transform((val) => (val.startsWith("55") ? `+${val}` : `+55${val}`))
  .refine((val) => /^\+55\d{10,11}$/.test(val), "Telefone brasileiro inválido");

export const cadastrarBeneficiarioSchema = z.object({
  nome: z.string().trim().min(1, "O nome da beneficiário é obrigatório"),
  nome_responsavel: z.string().trim().min(1, "O nome do responsável é obrigatório"),
  data_nascimento: z
    .string()
    .min(1, "A data de nascimento é obrigatória")
    .refine((val) => {
      const dataSelecionada = new Date(val);
      const hoje = new Date();
      return dataSelecionada <= hoje;
    }, "A data de nascimento precisa ser válida."),

  phone1: phoneSchema,
  phone2: phoneSchema.optional().or(z.literal("")),
  location: z.object({
    type: z.string(),
    coordinates: z.array(z.number()).length(2, "A localização precisa de Latitude e Longitude"),
  }),
});

export type cadastrarBeneficiarioType = z.infer<typeof cadastrarBeneficiarioSchema>;
