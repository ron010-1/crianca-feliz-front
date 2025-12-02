import { useEffect, useState } from "react";
import Input from "../../components/Input/Input";
import Style from "./login.module.css";
import Button from "../../components/button/Button";

export default function LoginAdmin() {
  const [name, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    document.title = "Admin Login";
  }, []);

  const validateForm = () => {
    const newErrors = { email: "", password: "" };

    if (!name.trim()){
      newErrors.email = "O email é obrigatório."
    };

    if (name && !name.includes("@")){
      newErrors.email = "Digite um email válido."
    };

    if (!password.trim()){ 
      newErrors.password = "A senha é obrigatória."
    };

    if (password && !/[A-Z]/.test(password)){
      newErrors.password = "A senha deve conter ao menos 1 letra maiúscula."
      };

    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  };

  const clearInputs = () =>{
    setEmail("");
    setPassword("");
  }
  const handleSubmit = () => {
    if (validateForm()) {
      alert("Login válido — execute aqui a lógica de login");
    }
    clearInputs();
  };

  const isFormValid = name && password && !errors.email && !errors.password;

  return (
    <div className={Style.forms}>
      <Input
        value={name}
        onChange={(v) => {
          setEmail(v);
          if (errors.email) validateForm();
        }}
        placeholder="Email"
        type="email"
      />
      {errors.email && (
        <p className={Style.error}>{errors.email}</p>
      )}

      <Input
        value={password} placeholder="Senha" type="password"
        onChange={(v) => {
          setPassword(v);
          if (errors.password) validateForm();
        }} 
        />
        {errors.password && (
        <p className={Style.error}>{errors.password}</p>
      )}

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
