import { Search, X } from "lucide-react"

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Tìm kiếm..."
}: Props) {

  return (
    <div className="relative w-full">

      {/* icon search */}
      <Search
        size={18}
        className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-gray-300 pl-7 pr-6 py-2 bg-transparent focus:outline-none focus:border-blue-500"
      />

      {/* clear button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}

    </div>
  )
}