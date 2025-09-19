import { useState } from "react";

type ReportCarProps = {
  id: string;
  imageUrl: string;
  name: string;
  date: Date;
  workhour: string;
  locale: string;
};

const Card = ({
  id,
  imageUrl,
  name,
  date,
  workhour,
  locale,
}: ReportCarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      key={id}
      className="bg-white  rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
    >
      <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
        <img src={imageUrl} alt="Report screenshot" className="w-full h-30" />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">
            {new Date(date).toLocaleDateString()}
          </p>
          <p className="mt-1 text-sm">Work hours: {workhour}</p>
          <p className="text-sm text-gray-500">Locale: {locale}</p>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={imageUrl}
            alt="Report screenshot"
            className="max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Card;
