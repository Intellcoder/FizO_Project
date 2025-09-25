import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { BiBell, BiSearch } from "react-icons/bi";
import { FaPhoenixSquadron } from "react-icons/fa";


const Header = () => {
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}`,
    };
  }
  const name = "Pgarnes";
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="bg-white p-3 flex justify-between items-center shadow-xl box-border">
      <div className="flex items-center">
        <span className="mr-2">
          <FaPhoenixSquadron size={25} className="text-primary" />
        </span>
        <Typography sx={{ fontWeight: 500, fontSize: "2rem" }}>
          FizO
          <span className="text-primary">Taggers</span>
        </Typography>
      </div>
      <div className="flex  justify-between  w-[30%]">
        <div className="hidden md:flex border-1 box rounded-full items-center  px-2  shadow-2xl">
          <input
            type="text"
            placeholder="Search"
            className="outline-none pl-4"
          />
          <BiSearch />
        </div>
        <div className=" rounded-full border-1 p-1 hidden md:flex">
          <BiBell size={40} />
        </div>
      
        <div className=" items-center flex">
          
          {/*avartar*/}
          <Avatar {...stringAvatar(formattedName)} />
          <p className="ml-2 text-xl font-medium">{formattedName}</p>
        </div>
         
      </div>
    </div>
  );
};

export default Header;
