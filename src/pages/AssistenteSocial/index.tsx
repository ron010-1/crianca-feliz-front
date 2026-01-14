import { useEffect, useState } from "react";
import { useNavigate} from "react-router";
import Input from "../../components/Input/Input";
import Button from "../../components/button/Button";
import Navbar from "../../components/navbar/Navbar";
import Style from "./assistente.module.css"
import Loading from "../../components/loading/Loading";

export default function FormAssistenteSocial() {
    
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
        navigate("/login");
        }
    }, [navigate]);
    if (!token) return null;

    const navButtons = [
        { label: 'Menu', onClick: () => console.log('Menu clicado'), variant: 'secondary' as const },
    ];

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
        document.title = "Cadastro de Assistente Social";
    }, []);

    useEffect(() => {
        if (hasSubmitted) validateForm();
    }, [email, password, nome, telefone]);

    const validateForm = () => {
        const newErrors = { email: "", password: "", api: "", telefone: "", nome: "" };
        let isValid = true;

        if (!nome.trim()) { newErrors.nome = "Nome é obrigatório"; isValid = false; }
        if (!telefone.trim()) { newErrors.telefone = "Telefone é obrigatório"; isValid = false; }
        if (!email.trim()) { newErrors.email = "Email é obrigatório"; isValid = false; }
        if (!password.trim()) { newErrors.password = "Senha é obrigatória"; isValid = false; }

        setErrors(newErrors);
        return isValid;
    };

    const clearInputs = () => {
        setEmail ("");
        setPassword ("");
        setNome ("");
        setTelefone ("");
    }

    const handleCreate = async () => {
        setHasSubmitted(true);
        if (!validateForm()) return;

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Erro de autenticação: Você precisa fazer login novamente.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                "https://criancafeliz-pw1-production.up.railway.app/assists", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ email, password, telefone, nome }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || data.error || "Erro ao cadastrar assistente.");
            }

            alert("Assistente cadastrado com sucesso!");
            clearInputs();
            setHasSubmitted(false)

        } catch (error: any) {
            setErrors(prev => ({ ...prev, api: error.message }));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={Style.page}>
            <Navbar
                logoUrl="/vite.svg"
                brandName="SIGPCF"
                buttons={navButtons}
            />
            <main className={Style.mainContainer}>
                <h1 className={Style.title}>
                    Cadastro de assistente social
                </h1>

                <div className={Style.inputGroup}>
                    <Input
                        value={nome}
                        onChange={setNome}
                        placeholder="Nome*"
                        type="text"
                    />
                    {hasSubmitted && errors.nome && (
                        <p className={Style.error}>{errors.nome}</p>
                    )}
                </div>

                <div className={Style.inputGroup}>
                    <Input
                        value={telefone}
                        onChange={setTelefone}
                        placeholder="Telefone*"
                        type="number"
                    />
                    {hasSubmitted && errors.telefone && (
                        <p className={Style.error}>{errors.telefone}</p>
                    )}
                </div>

                <div className={Style.inputGroup}>
                    <Input
                        value={email}
                        onChange={setEmail}
                        placeholder="Email*"
                        type="email"
                    />
                    {hasSubmitted && errors.email && (
                        <p className={Style.error}>{errors.email}</p>
                    )}
                </div>

                <div className={Style.inputGroup}>
                    <Input
                        value={password}
                        onChange={setPassword}
                        placeholder="Senha*"
                        type="password"
                    />
                    {hasSubmitted && errors.password && (
                        <p className={Style.error}>{errors.password}</p>
                    )}
                </div>

                {errors.api && (
                    <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                        {errors.api}
                    </div>
                )}

                <div className={Style.buttonWrapper}>
                    <Button
                        label={
                            loading ? (
                                <Loading size="sm" message="Salvando..." />
                            ) : (
                                "Cadastrar" 
                            )
                        }
                        variant="primary"
                        type="button"
                        onClick={handleCreate}
                        disabled={loading}
                    />
                </div>

            </main>
        </div>
    )
}