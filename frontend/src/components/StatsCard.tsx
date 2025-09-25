import React from "react";

type Props = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

const StatsCard = ({ title, value, icon }: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-m p-6 flex items-center gap-4 h-30">
      <div
        className="p-3 rounded-full"
        style={{ background: "#e6e8fd", color: "#4153ef" }}
      >
        {icon}
      </div>
      <div>
        <h1 className="text-gray-900 font-semibold">{title}</h1>
        <p className="text-2xl font-bold" style={{ color: "#415ef" }}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
