import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  className = ""
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

      <input
        type={showPassword ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        required
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
      </button>
    </div>
  );
}