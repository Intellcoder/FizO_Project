type Props = {
  placeholder: string;
};

const InputBox = ({ placeholder }: Props) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="bg-gray-200 p-1 w-full rounded-sm"
    />
  );
};

export default InputBox;
