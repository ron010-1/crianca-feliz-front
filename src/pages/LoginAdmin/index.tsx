import { useEffect, useState } from "react";
import Input from "../../components/Input/Input";
import Style from "./login.module.css";
import Button from "../../components/button/Button";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    document.title = "Admin Login";
  }, []);

  useEffect(() => {
    validateForm();
  }, [email, password]);

  const validateForm = () => {
    const newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "O email é obrigatório.";
    } else if (!email.includes("@")) {
      newErrors.email = "Digite um email válido.";
    }

    if (!password.trim()) {
      newErrors.password = "A senha é obrigatória.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "A senha deve conter ao menos 1 letra maiúscula.";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const handleSubmit = () => {
    if (validateForm()) {
      alert("Login válido");
      clearInputs();
    }
  };

  const isFormValid = email && password && !errors.email && !errors.password;

  return (
    <div className={Style.forms}>
      <Input
        value={email}
        onChange={(v) => setEmail(v)}
        placeholder="Email"
        type="email"
      />
      {errors.email && <p className={Style.error}>{errors.email}</p>}

      <Input
        value={password}
        placeholder="Senha"
        type="password"
        onChange={(v) => setPassword(v)}
      />
      {errors.password && <p className={Style.error}>{errors.password}</p>}

      <div className={Style.buttonWrapper}>
        <Button
          label="Entrar"
          variant="primary"
          type="button"
          disabled={!isFormValid}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}