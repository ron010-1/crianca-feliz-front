import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,ArcElement, Title,Tooltip,Legend,} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useMemo } from "react";
import type { VisitaType } from "../../models/visita";
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );
  
interface Props {
    visitas: VisitaType[];
}
  
const VisitaMonth = ({ visitas }: Props) => {
    const data = useMemo(() => {
      const acc: Record<string, { count: number; dateRef: number }> = {};
  
      visitas.forEach((v) => {
        if (!v.data) return;
        const dateObj = new Date(v.data);
        
        const label = dateObj.toLocaleString("pt-BR", { month: "short", year: "numeric" });
        
        const sortKey = dateObj.getFullYear() * 100 + dateObj.getMonth();
  
        if (!acc[label]) {
          acc[label] = { count: 0, dateRef: sortKey };
        }
        acc[label].count += 1;
      });
      const sortedData = Object.entries(acc)
        .map(([label, info]) => ({ label, ...info }))
        .sort((a, b) => a.dateRef - b.dateRef); 
  
      return {
        labels: sortedData.map((d) => d.label),
        datasets: [
          {
            label: "Visitas realizadas",
            data: sortedData.map((d) => d.count),
            backgroundColor: "#3b82f6",
            borderRadius: 4,
          },
        ],
      };
    }, [visitas]);
  
    const options = {
      responsive: true,
      plugins: {
        legend: { position: "bottom" as const },
        title: { display: true, text: "Evolução de Visitas" },
      },
    };
  
    return <Bar data={data} options={options} />;
  };
  
  export default VisitaMonth;
  