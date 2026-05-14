interface ThongKeCardProps {
  title: string
  value: number
  color?: string
}

const ThongKeCard = ({
  title,
  value,
  color = "text-black"
}: ThongKeCardProps) => {

  return (
    <div
      className="
        bg-white
        border
        rounded-xl
        shadow-sm
        p-4
      "
    >

      <div className="text-sm text-gray-500 mb-2">
        {title}
      </div>

      <div
        className={`
          text-3xl
          font-bold
          ${color}
        `}
      >
        {value}
      </div>

    </div>
  )
}

export default ThongKeCard