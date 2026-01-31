import { ToastContainer } from "react-toastify";
import "./App.css";
import Router from "./routes/Router";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useEffect } from "react";
import { authConstants } from "./constants/auth.constants";
import { setToken } from "./store/auth/authSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem(authConstants.NAME_TOKEN_IN_STORAGE);
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer theme="colored" />
      <Router />
    </>
  );
}

export default App;