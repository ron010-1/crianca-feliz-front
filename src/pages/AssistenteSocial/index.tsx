import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAppSelector } from "../../hooks/useAppSelector";
import Input from "../../components/Input/Input";
import Button from "../../components/button/Button";
import Style from "./assistente.module.css";
import Loading from "../../components/loading/Loading";


export default function FormAssistenteSocial() {
  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const location = useLocation();

  const assistenteParaEditar = location.state?.assistente;
  const isEditing = !!assistenteParaEditar;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    nome: "",
    telefone: "",
    email: "",
    password: "",
    api: "",
  });

  useEffect(() => {
    document.title = isEditing ? "Editar Assistente Social" : "Cadastro de Assistente Social";
  }, [isEditing]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (assistenteParaEditar) {
      setNome(assistenteParaEditar.nome);
      setEmail(assistenteParaEditar.email);
      setTelefone(assistenteParaEditar.telefone);
    }
  }, [assistenteParaEditar]);


  useEffect(() => {
    if (hasSubmitted) validateForm();
  }, [email, password, nome, telefone]);

  const validateForm = () => {
    const newErrors = { email: "", password: "", api: "", telefone: "", nome: "" };
    let isValid = true;

    if (!nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
      isValid = false;
    }
    if (!telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    }

    if (!isEditing && !password.trim()) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    setHasSubmitted(true);
    if (!validateForm()) return;

    if (!token) {
      alert("Erro de autenticação: Você precisa fazer login novamente.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const url = isEditing
        ? `https://criancafeliz-pw1-production.up.railway.app/assists/${assistenteParaEditar.id}`
        : "https://criancafeliz-pw1-production.up.railway.app/assists";

      const method = isEditing ? "PATCH" : "POST";
      const bodyData: any = { email, telefone, nome };

      if (password.trim()) {
        bodyData.password = password;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Erro ao salvar assistente.");
      }

      alert(isEditing ? "Assistente atualizado com sucesso!" : "Assistente cadastrado com sucesso!");

      navigate("/assistente/view");
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, api: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.page}>
      <main className={Style.mainContainer}>
      <div className={Style.buttonVoltar}>
        <Button
          label="Voltar"
          variant="primary"
          title="Voltar para listagem de beneficiários"
          onClick={() => navigate("/assistente/view")}
        />
      </div>
        <h1 className={Style.title}>{isEditing ? "Editar assistente social" : "Cadastro de assistente social"}</h1>

        <div className={Style.inputGroup}>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome*" type="text" />
          {hasSubmitted && errors.nome && <p className={Style.error}>{errors.nome}</p>}
        </div>

        <div className={Style.inputGroup}>
          <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Telefone*" type="number" />
          {hasSubmitted && errors.telefone && <p className={Style.error}>{errors.telefone}</p>}
        </div>

        <div className={Style.inputGroup}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email*" type="email" />
          {hasSubmitted && errors.email && <p className={Style.error}>{errors.email}</p>}
        </div>

        <div className={Style.inputGroup}>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isEditing ? "Nova Senha (deixe vazio para manter)" : "Senha*"}
            type="password"
          />
          {hasSubmitted && errors.password && <p className={Style.error}>{errors.password}</p>}
        </div>

        {errors.api && <div className={Style.apiErrorBox}>{errors.api}</div>}

        <div className={Style.buttonWrapper}>
          <Button
            label={
              loading ? (
                <Loading size="sm" message={isEditing ? "Atualizando..." : "Salvando..."} />
              ) : isEditing ? (
                "Salvar Alterações"
              ) : (
                "Cadastrar"
              )
            }
            variant="primary"
            type="button"
            onClick={handleSave}
            disabled={loading}
          />
        </div>
      </main>
    </div>
  );
}
