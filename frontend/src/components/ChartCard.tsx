import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

const ChartCard = ({ title, children }: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <h1 className="text-gray-900 font-semibold mb-4">{title}</h1>
      <div className="w-full h-64">{children}</div>
    </div>
  );
};

export default ChartCard;
