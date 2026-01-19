import { ToastContainer } from "react-toastify";
import "./App.css";
import Router from "./routes/Router";

function App() {
  return (
    <>
      <ToastContainer theme="colored" />
      <Router />
    </>
  );
}

export default App;