import { useEffect, useState } from "react";
import Input from "../../components/Input";
import { Button } from "../../stories/Button";
import Style from "./login.module.css";

export default function LoginAdmin() {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "Admin Login";
  }, []);

  return (
    <div className={Style.forms}>
      <Input 
        value={name}
        onChange={setName}
        placeholder="Nome"
      />

      <Input 
        value={password}
        onChange={setPassword}
        placeholder="Senha"
        type="password"
      />

      <div className={Style.buttonWrapper}>
        <Button 
        label="Entrar" 
        backgroundColor="#07ce2f5f" 
        />
      </div>
    </div>
  );
}
