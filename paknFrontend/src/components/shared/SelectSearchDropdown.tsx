import { useState, useRef, useEffect } from "react"

interface Option {
  label: string
  value: string
}

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SelectSearchDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Chọn..."
}: Props) => {

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const ref = useRef<HTMLDivElement>(null)

  // đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selected = options.find(o => o.value === value)

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div ref={ref} className="relative">

      {/* Input */}
      <div
        className="border p-2 rounded cursor-pointer bg-white"
        onClick={() => setOpen(!open)}
      >
        {selected ? selected.label : placeholder}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 w-full bg-white border rounded mt-1 shadow max-h-60 overflow-y-auto">

          {/* Search */}
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border-b outline-none"
          />

          {/* List */}
          {filtered.length > 0 ? (
            filtered.map((o) => (
              <div
                key={o.value}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                  setSearch("")
                }}
                className="p-2 hover:bg-blue-100 cursor-pointer"
              >
                {o.label}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">Không tìm thấy</div>
          )}

        </div>
      )}
    </div>
  )
}

export default SelectSearchDropdown