import type React from "react";

type Props = {
  icon?: React.ReactNode;
  icon2?: React.ReactNode;
  backgroundColor?: string;
  backgroundColor2?: string;
  title: string;
  value: string;
  textColor: string;
  iconColor: string;
};

const Container = ({
  icon,
  icon2,
  backgroundColor,
  backgroundColor2,
  title,
  iconColor,
  textColor,
  value,
}: Props) => {
  return (
    <div
      className={` h-40 p-2 m-2 overflow-hidden rounded-md bg-${backgroundColor}`}
    >
      <div className="flex justify-between ">
        {icon && (
          <div
            className={`flex-shrink-0 text-3xl p-2 bg-white w-12 rounded-lg  text-${iconColor} mb-2`}
          >
            {icon}
          </div>
        )}
        <span
          className={`text-xl ml-1  text-center font-medium text-${textColor} pt-2`}
        >
          {title}
        </span>
        {icon2 && (
          <div
            className={`text-2xl flex items-center ml-2 self-center rounded-xl p-1 bg-${backgroundColor2}`}
          >
            {icon2}
          </div>
        )}
      </div>

      <h1 className="text-black text-center text-xl text-wrap">{value}</h1>
    </div>
  );
};

export default Container;
