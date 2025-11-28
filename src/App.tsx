import "./App.css";
import { ToastContainer } from "react-toastify";
import TabelaBeneficiarios from "./components/tabela-beneficiarios/TabelaBeneficiarios";
import type { BeneficiarioType } from "./models/beneficiario";
import CustomViewMap from "./components/custom-map/CustomViewMap";

function App() {
  const beneficiariosMock: BeneficiarioType[] = [
    {
      id: 1,
      name: "Ana Clara Ferreira",
      responsavel: "João Ferreira",
      dataNascimento: "12/07/2010",
      location: "Rua das Flores, 120 - João Pessoa",
      telefone1: "(83) 99111-2233",
      telefone2: "(83) 98822-4455",
    },
    {
      id: 2,
      name: "Carlos Eduardo Santos",
      responsavel: "Mariana Santos",
      dataNascimento: "03/02/2015",
      location: "Av. Principal, 450 - Cabedelo",
      telefone1: "(83) 99777-8899",
    },
    {
      id: 3,
      name: "Beatriz Moura",
      responsavel: "Silvia Moura",
      dataNascimento: "25/11/2008",
      location: "Rua das Acácias, 85 - Santa Rita",
      telefone1: "(83) 98444-5566",
      telefone2: "(83) 98123-9876",
    },
    {
      id: 4,
      name: "Lucas Henrique Alves",
      responsavel: "Pedro Alves",
      dataNascimento: "09/05/2012",
      location: "Rua Projetada, 300 - Bayeux",
      telefone1: "(83) 99666-5544",
    },
    {
      id: 5,
      name: "Maria Eduarda Lima",
      responsavel: "Juliana Lima",
      dataNascimento: "18/01/2014",
      location: "Rua da Mata, 42 - João Pessoa",
      telefone1: "(83) 99912-3322",
      telefone2: "(83) 98765-1122",
    },
  ];

  const pessoa = {
    nome: "Diego Sousa",
    coordenadas: [-7.118, -34.873],
  };
  const center = pessoa.coordenadas;
  const markers = [
    {
      localizacao: pessoa.coordenadas,
    },
  ];

  return (
    <>
      {/* <ToastContainer theme="colored" />
      <span>Hello World!</span>
      <TabelaBeneficiarios beneficiarios={beneficiariosMock} /> */}
      <div style={{ height: "500px", width: "700px" }}>
        <CustomViewMap center={center} markers={markers} />
      </div>
    </>
  );
}

export default App;
