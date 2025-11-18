import { useState } from "react";
import "./App.css";
import ExcludeModal from "./components/exclude-modal/ExcludeModal";
import { Button } from "./stories/Button";

function App() {
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleExclude = () => {
    window.alert("Registro excluido com sucesso");
    handleClose();
  };

  return (
    <div>
      <span>Hello World!</span>
      <Button label="Abrir modal" onClick={() => setOpen(true)} />
      <ExcludeModal open={open} onClose={handleClose} onExclude={handleExclude} />
    </div>
  );
}

export default App;
