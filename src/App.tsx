import { useEffect } from "react";
import { useNavigate } from "react-router"; 
import "./App.css";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  if (!token) return null;

  return (
    <>
      <h1>Hello World!</h1>
    </>
  );
}

export default App;