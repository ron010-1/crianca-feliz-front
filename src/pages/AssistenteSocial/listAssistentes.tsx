import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/navbar/Navbar";
import Button from "../../components/button/Button";
import TabelaAssistentes, { type AssistenteType } from "../../components/tabela-assistentes/TabelaAssistentes";
import Style from "./assistente.module.css"; 

export default function ListAssistentes() {
  const navigate = useNavigate();
  const [assistentes, setAssistentes] = useState<AssistenteType[]>([]);
  const [loading, setLoading] = useState(false);

  const navButtons = [
    { label: 'Sair', onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
    }, variant: 'secondary' as const },
  ];

  const fetchAssistentes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch("https://criancafeliz-pw1-production.up.railway.app/assists", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        let listaReal: any[] = [];
        const data = await response.json();
        if (data.rows && Array.isArray(data.rows)) {
            listaReal = data.rows; 
        } else if (Array.isArray(data)) {
            listaReal = data;
        }

        const formattedData = listaReal.map((item: any) => ({
            ...item,
            id: String(item.id || item._id || item.uuid) 
        }));

        setAssistentes(formattedData);
      } else {
        console.error("Erro ao buscar assistentes");
      }
    } catch (error) {
      console.error("Erro de conexão", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssistentes();
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`https://criancafeliz-pw1-production.up.railway.app/assists/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Assistente excluído com sucesso!");
        setAssistentes((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Erro ao excluir assistente.");
      }
    } catch (error) {
      alert("Erro de conexão ao tentar excluir.");
    }
  };

  const handleEdit = (assistente: AssistenteType) => {
    navigate("/assistente", { 
        state: { assistente } 
    });
  };

  const handleNew = () => {
    navigate("/assistente");
  };

  return (
    <div className={Style.page}>
      <Navbar 
        logoUrl="/vite.svg" 
        brandName="SIGPCF" 
        buttons={navButtons} 
      />
      
      <main className={Style.mainContainerList}>
        
        <div className={Style.headerList}>
            <h1 className={Style.title}>Assistentes Sociais</h1>
            <div style={{ width: '200px' }}>
                <Button 
                    label="Novo Assistente" 
                    onClick={handleNew} 
                    variant="primary" 
                />
            </div>
        </div>

        <TabelaAssistentes 
            assistentes={assistentes}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            paginationDetails={{
                pagination: { page: 1, limit: 100, totalItens: assistentes.length },
                onPageChange: () => {}
            }}
        />

      </main>
    </div>
  );
}