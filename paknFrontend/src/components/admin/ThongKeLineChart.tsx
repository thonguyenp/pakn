import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

type Props = {
  title: string
  data: any[]
  dataKey: string
  xKey: string
  color?: string
}

export default function ThongKeLineChart({
  title,
  data,
  dataKey,
  xKey,
  color = "#2563eb",
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5 h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        {title}
      </h2>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey={xKey} />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}