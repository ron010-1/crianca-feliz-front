import "./App.css";
import { ToastContainer } from "react-toastify";
import TabelaBeneficiarios from "./components/tabela-beneficiarios/TabelaBeneficiarios";
import type { BeneficiarioType } from "./models/beneficiario";

function App() {
  const beneficiariosMock: BeneficiarioType[] = [
    {
      id: 1,
      name: "Ana Clara Ferreira",
      responsavel: "João Ferreira",
      dataNascimento: "12/07/2010",
      location: [-7.119495, -34.845011],
      telefone1: "(83) 99111-2233",
      telefone2: "(83) 98822-4455",
    },
    {
      id: 2,
      name: "Carlos Eduardo Santos",
      responsavel: "Mariana Santos",
      dataNascimento: "03/02/2015",
      location: [-7.00085, -34.833001],
      telefone1: "(83) 99777-8899",
    },
    {
      id: 3,
      name: "Beatriz Moura",
      responsavel: "Silvia Moura",
      dataNascimento: "25/11/2008",
      location: [-7.135725, -34.97521],
      telefone1: "(83) 98444-5566",
      telefone2: "(83) 98123-9876",
    },
    {
      id: 4,
      name: "Lucas Henrique Alves",
      responsavel: "Pedro Alves",
      dataNascimento: "09/05/2012",
      location: [-7.12543, -34.9325],
      telefone1: "(83) 99666-5544",
    },
    {
      id: 5,
      name: "Maria Eduarda Lima",
      responsavel: "Juliana Lima",
      dataNascimento: "18/01/2014",
      location: [-7.11532, -34.86145],
      telefone1: "(83) 99912-3322",
      telefone2: "(83) 98765-1122",
    },
  ];

  return (
    <>
      <ToastContainer theme="colored" />
      <span>Hello World!</span>
      <TabelaBeneficiarios beneficiarios={beneficiariosMock} />
    </>
  );
}

export default App;
