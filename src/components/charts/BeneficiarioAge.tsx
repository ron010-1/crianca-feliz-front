import { Doughnut } from "react-chartjs-2";
import { useMemo } from "react";
import type { BeneficiarioType } from "../../models/beneficiario";

interface Props {
  beneficiarios: BeneficiarioType[];
}

const BeneficiarioAge = ({ beneficiarios }: Props) => {
  const data = useMemo(() => {
    const grupos = {
      "0-12 (Criança)": 0,
      "13-17 (Adolescente)": 0
    };

    beneficiarios.forEach((b) => {
      if (!b.data_nascimento) return;
      
      const nascimento = new Date(b.data_nascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();
      
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }

      if (idade <= 12) grupos["0-12 (Criança)"]++;
      else if (idade <= 17) grupos["13-17 (Adolescente)"]++;
    });

    return {
      labels: Object.keys(grupos),
      datasets: [
        {
          data: Object.values(grupos),
          backgroundColor: [
            "#60a5fa", 
            "#34d399", 
            "#fbbf24", 
            "#f87171", 
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [beneficiarios]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "right" as const },
      title: { display: true, text: "Faixa Etária" },
    },
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default BeneficiarioAge;