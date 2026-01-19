import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import LoginAdmin from "../pages/LoginAdmin";
import FormAssistenteSocial from "../pages/AssistenteSocial";
import ListAssistentes from "../pages/AssistenteSocial/listAssistentes";
import Layout from "./layout/Layout";
import ListagemBeneficiariosPage from "../pages/Beneficiario/Listagem/ListagemBeneficiarios";
import CadastroBeneficiarioPage from "../pages/Beneficiario/Formulario/CadastroBeneficiarioPage";
import EditarBeneficiarioPage from "../pages/Beneficiario/Formulario/EditarBeneficiarioPage";
import { useAppSelector } from "../hooks/useAppSelector";

const PrivateRoutes = () => {
  const token = useAppSelector((state) => state.auth.token);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoutes = () => {
  const token = useAppSelector((state) => state.auth.token);

  return !token ? <Outlet /> : <Navigate to="/" replace />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<p>Hello World!</p>} />
            <Route path="/assistente" element={<FormAssistenteSocial />} />
            <Route path="/assistente/view" element={<ListAssistentes/>} />
            <Route path="/beneficiarios" element={<ListagemBeneficiariosPage />} />
            <Route path="/beneficiarios/cadastrar" element={<CadastroBeneficiarioPage />} />
            <Route path="/beneficiarios/:id/editar" element={<EditarBeneficiarioPage />} />
          </Route>

          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<LoginAdmin />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
