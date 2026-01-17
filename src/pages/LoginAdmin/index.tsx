import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Input from "../../components/Input/Input";
import Style from "./login.module.css";
import Button from "../../components/button/Button";
import Navbar from "../../components/navbar/Navbar";
import Loading from "../../components/loading/Loading";

interface LoginResponse {
  token: string;
}

interface ApiError {
  message?: string;
  error?: string;
}

export default function LoginAdmin() {
  const navButtons = [
    {
      label: "Sobre",
      onClick: () => window.open("https://cadunicobrasil.com.br/crianca-feliz-2025-como-funciona-e-quem/", "_blank"),
      variant: "primary" as const,
    },
  ];

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string>("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    api: "",
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Login - Criança Feliz";
  }, []);

  useEffect(() => {
    if (hasSubmitted) validateForm();
  }, [email, password]);

  const validateForm = () => {
    const newErrors = { email: "", password: "", api: "" };
    if (!email.trim()) newErrors.email = "O email é obrigatório.";
    if (!password.trim()) newErrors.password = "A senha é obrigatória.";
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    setHasSubmitted(true);
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await fetch("https://criancafeliz-pw1-production.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const apiError = data as ApiError;
        throw new Error(apiError.message || apiError.error || "Erro ao realizar login");
      }

      const loginData = data as LoginResponse;
      setToken(loginData.token);
      localStorage.setItem("token", loginData.token);
      navigate("/");
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, api: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.page}>
      {/* <Navbar 
        logoUrl="/vite.svg" 
        brandName="SIGPCF" 
        buttons={navButtons} 
      /> */}

      <main className={Style.mainContainer}>
        <section className={Style.heroSection}>
          <div className={Style.heroContent}>
            <h1 className={Style.heroTitle}>Sistema de gerenciamento do programa criança feliz</h1>
            <p className={Style.heroDescription}>
              Conectando assistentes sociais dedicados a crianças que precisam de acompanhamento e cuidado.
            </p>
            <img src="/public/vite.svg" alt="Ilustração do sistema" className={Style.heroImage} />
          </div>
        </section>

        <section className={Style.formSection}>
          <div className={Style.formsContainer}>
            <h2 className={Style.formTitle}>Acesse sua conta</h2>

            <div className={Style.inputGroup}>
              <Input value={email} onChange={setEmail} placeholder="Email*" type="email" />
              {hasSubmitted && errors.email && <p className={Style.error}>{errors.email}</p>}
            </div>

            <div className={Style.inputGroup}>
              <Input value={password} onChange={setPassword} placeholder="Senha*" type="password" />
              {hasSubmitted && errors.password && <p className={Style.error}>{errors.password}</p>}
            </div>

            {errors.api && <div className={Style.apiErrorBox}>{errors.api}</div>}

            <div className={Style.buttonWrapper}>
              <Button
                label={loading ? <Loading size="sm" message="Entrando..." /> : "Entrar"}
                variant="primary"
                type="button"
                onClick={handleLogin}
                disabled={loading}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
