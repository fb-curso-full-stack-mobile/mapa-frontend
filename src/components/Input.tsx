import { FieldValues, UseFormRegister } from "react-hook-form";
import "./Input.css";

type InputProps = {
  placeholder?: string;
  register?: UseFormRegister<FieldValues>;
  name?: string;
};

export default function Input({ placeholder, register, name }: InputProps) {
  const additionalProps = register && name ? { ...register(name) } : {};
  return (
    <input
      type="text"
      className="my-input"
      placeholder={placeholder}
      {...additionalProps}
    />
  );
}
