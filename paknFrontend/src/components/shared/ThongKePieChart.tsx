import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

type Props = {
  title: string
  data: any[]
  dataKey: string
  nameKey: string
  colors?: string[]
  unit?: string
}

const DEFAULT_COLORS = ["#22c55e", "#eab308", "#ef4444", "#3b82f6", "#8b5cf6"]

export default function ThongKePieChart({
  title,
  data,
  dataKey,
  nameKey,
  colors = DEFAULT_COLORS,
  unit = ""
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-5">
      <h2 className="text-base md:text-lg font-semibold mb-4 text-center">
        {title}
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ percent }) =>
                `(${(percent * 100).toFixed(0)}%)`
              }
            >
              {data.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(value) => `${value} ${unit}`} />

            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}