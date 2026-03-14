interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}

export default function ToggleSwitch({ checked, onChange, label }: Props) {
  return (
    <div className="flex items-center gap-3">

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 
        ${checked ? "bg-blue-600" : "bg-gray-300"}`}
      >

        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
          transform transition-transform duration-300
          ${checked ? "translate-x-6" : "translate-x-0"}`}
        />

      </button>

      {label && (
        <span className="text-sm text-gray-700">
          {label}
        </span>
      )}

    </div>
  );
}