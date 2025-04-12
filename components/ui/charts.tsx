// components/ui/charts.tsx
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function BarChart({ data, title }: { data: Record<string, number>; title: string }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ReBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChart({ data, title }: { data: Array<{ name: string; value: number }>; title: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChart({ data, title }: { data: Array<{ name: string; value: number }>; title: string }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RePieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}