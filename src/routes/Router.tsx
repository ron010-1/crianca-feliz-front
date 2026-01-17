import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import LoginAdmin from "../pages/LoginAdmin";
import FormAssistenteSocial from "../pages/AssistenteSocial";
import ListAssistentes from "../pages/AssistenteSocial/listAssistentes";
import Layout from "./Layout";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoutes = () => {
  const token = localStorage.getItem("token");

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
            <Route path="/assistente/view" element={<ListAssistentes />} />
            <Route path="/beneficiarios" element={<p>beneficiarios page</p>} />
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
