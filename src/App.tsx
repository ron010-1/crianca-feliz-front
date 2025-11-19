import { useState } from "react";
import "./App.css";
import ExcludeModal from "./components/exclude-modal/ExcludeModal";
import { Button } from "./stories/Button";
import { toast, ToastContainer } from "react-toastify";

function App() {
  const [open, setOpen] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleExclude = async () => {
    setLoading(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setLoading(false);
        resolve();
      }, 2000);
    });
    handleClose();
    toast.success("Registro excluido com sucesso");
  };

  return (
    <>
      <ToastContainer theme="colored" />
      <span>Hello World!</span>
      <Button label="Abrir modal" onClick={() => setOpen(true)} />
      <ExcludeModal open={open} onClose={handleClose} onExclude={handleExclude} loading={loading} message="exluir?" />
    </>
  );
}

export default App;
