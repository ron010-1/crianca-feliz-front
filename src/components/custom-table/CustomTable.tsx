import type { ReactNode } from "react";
import "./style.css";

interface CustomTableProps<T> {
  columns: {
    name: string;
    accessor: (row: T) => ReactNode;
  }[];
  data: T[];
}

const CustomTable = <T,>({ columns, data }: CustomTableProps<T>) => {
  return (
    <table className="custom-table">
      <thead>
        <tr className="table-row">
          {columns.map((colum) => (
            <th key={colum.name}>{colum.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr className="table-row" key={index}>
            {columns.map((colum) => (
              <td className="row-colum" key={colum.name}>
                {colum.accessor(row) || "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomTable;
