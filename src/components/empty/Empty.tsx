import { type ElementType } from "react";
import { FaRegFolderOpen } from "react-icons/fa";
import "./style.css";

type SizeProps = "sm" | "md" | "lg";

interface EmptyProps {
  message?: string;
  subtext?: string;
  icon?: ElementType;
  size?: SizeProps;
  noBackground?: boolean;
}

const Empty = ({
  message = "Nenhum item encontrado",
  subtext = "Verifique seus filtros ou adicione novos itens para preencher esta lista.",
  icon: IconComponent = FaRegFolderOpen,
  size = "md",
  noBackground = false,
}: EmptyProps) => {
  const iconClassName = `empty-icon icon-${size}`;
  const messageClassName = `message-empty message-${size}`;
  const subtextClassName = `subtext-empty subtext-${size}`;
  const containerClassName = `container-empty container-${size}`;
  const noBackgroundClass = noBackground ? "" : "container-empty-with-background";

  return (
    <div className={`${containerClassName} ${noBackgroundClass}`}>
      <IconComponent className={iconClassName} />

      <span className={messageClassName}>{message}</span>

      {subtext && <p className={subtextClassName}>{subtext}</p>}
    </div>
  );
};

export default Empty;
