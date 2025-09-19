import Avatar from "@mui/material/Avatar";
import { BiStar } from "react-icons/bi";

type Props = {
  name: string;
  locale: string;
  email: string;
};

const ProfileCard = ({ name, locale, email }: Props) => {
  return (
    <div className="p-2 mt-3 flex flex-col items-center  w-full">
      <Avatar sx={{ width: 54, height: 54 }} />
      <div className="w-[90%]  text-xl font-medium mt-3">
        <div className="flex">
          <label className="text-gray-600">Name:</label>
          <h1 className="ml-1 text-gray-500">{name}</h1>
        </div>
        <div className="flex">
          <label className="text-gray-600">Locale:</label>
          <h1 className="ml-1 text-gray-500">{locale}</h1>
        </div>
        <div className="flex">
          <label className="text-gray-600">Email:</label>
          <h1 className="ml-1 text-gray-500">{email}</h1>
        </div>
      </div>
      <div className="flex bg-green-400 h-32 w-[90%] rounded-lg items-center justify-center-safe mt-4">
        <BiStar className="text-gray-200 text-2xl mr-2 md:text-4xl" />
        <div className="text-gray-100 text-xl ml-3 md:text-xl">
          <h1>Great,Job {name}</h1>
          <h1>You are grinding it.</h1>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
