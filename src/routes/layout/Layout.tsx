import { Outlet } from "react-router";
import Navbar from "../../components/navbar/Navbar";
import ConfirmModal from "../../components/confirm-modal/ConfirmModal";
import { useLayout } from "./useLayout";

const Layout = () => {
  const { 
    navButtonsLoggedIn, 
    navButtonsNotLoggedIn, 
    handleCloseLogoutModal, 
    handleLogout, 
    openLogoutModal, 
    token 
  } = useLayout();

  return (
    <>
      <Navbar 
        logoUrl="/logo.png" 
        brandName="SIGPCF" 
        buttons={token ? navButtonsLoggedIn : navButtonsNotLoggedIn} 
      />
      
      <Outlet />

      <ConfirmModal
        message={
          <span>
            Deseja realmente <strong>sair da aplicação</strong>?
          </span>
        }
        open={openLogoutModal}
        onClose={handleCloseLogoutModal}
        onAction={handleLogout}
      />
    </>
  );
};

export default Layout;