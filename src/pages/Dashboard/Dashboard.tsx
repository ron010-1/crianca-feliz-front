import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { BeneficiarioRequests } from "../../api/beneficiario/beneficiarioRequests";
import { VisitasRequests } from "../../api/visitas/visitasRequests";
import type { BeneficiarioType } from "../../models/beneficiario";
import type { VisitaType } from "../../models/visita";
import VisitaMonth from "../../components/charts/VisitaMonth";
import BeneficiarioAge from "../../components/charts/BeneficiarioAge";

import Style from "./dashboard.module.css";
import Loading from "../../components/loading/Loading";

const Dashboard = () => {
  const token = useAppSelector((state) => state.auth.token);
  const [beneficiarios, setBeneficiarios] = useState<BeneficiarioType[]>([]);
  const [visitas, setVisitas] = useState<VisitaType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const [benefRes, visitaRes] = await Promise.all([
          BeneficiarioRequests.get(token),
          VisitasRequests.get(token),
        ]);
        setBeneficiarios(benefRes.rows);
        setVisitas(visitaRes.rows);
      } catch (err) {
        console.error("Erro ao carregar dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  if (loading) {
    return (
      <div className={Style.loadingContainer}>
        <Loading size="lg" message="Carregando indicadores..." />
      </div>
    );
  }

  return (
    <div className={Style.dashboardContainer}>
      <header className={Style.header}>
        <h1>Visão Geral</h1>
        <p>Acompanhamento de métricas</p>
      </header>

      <div className={Style.cardsGrid}>
        <div className={Style.card}>
          <h3>Total Beneficiários</h3>
          <span className={Style.bigNumber}>{beneficiarios.length}</span>
        </div>
        <div className={Style.card}>
          <h3>Total Visitas</h3>
          <span className={Style.bigNumber}>{visitas.length}</span>
        </div>
        <div className={Style.card}>
          <h3>Média Visitas/Benef.</h3>
          <span className={Style.bigNumber}>
            {beneficiarios.length > 0 
              ? (visitas.length / beneficiarios.length).toFixed(1) 
              : 0}
          </span>
        </div>
      </div>

      <div className={Style.chartsGrid}>
        <div className={Style.chartCard}>
          <VisitaMonth visitas={visitas} />
        </div>
        
        <div className={Style.chartCard}>
           <BeneficiarioAge beneficiarios={beneficiarios} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;