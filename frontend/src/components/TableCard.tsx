type Props = {
  title: string;
  header: string[];
  rows: string[][];
};

const TableCard = ({ title, header, rows }: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <h3 className="text-gray-900 font-semibold mb-4">{title}</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={i} className="py-2 border-b text-gray-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {row.map((cell, j) => (
                <td key={j} className="py-2 border-b text-gray-600">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableCard;
