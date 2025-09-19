import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";

type ListProps = {
  name: string;
  locale: string;
  totalhours: number;
};

const formatedTime = (hours: number) => {
  const safehours = typeof hours === "number" && !isNaN(hours) ? hours : 0;
  hours = safehours / 3600;
  return hours.toFixed(3);
};
const ListContainer = ({ name, locale, totalhours }: ListProps) => {
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

  const acctname = name.charAt(0).toUpperCase() + name.slice(1);
  const localeName = locale.charAt(0).toUpperCase() + locale.slice(1);

  return (
    <div className=" ">
      <div className="flex items-center pl-2 ">
        <ListItemAvatar className="">
          <Avatar {...stringAvatar(acctname)} />
        </ListItemAvatar>
        <ListItemText
          className="pl-2"
          primary={`${acctname}`}
          secondary={`${localeName}`}
        />
        <ListItemText
          className="self-end"
          primary={`Total Hours`}
          secondary={`${formatedTime(totalhours)}`}
        />
      </div>
      <hr className=" text-gray-300" />
    </div>
  );
};

export default ListContainer;
