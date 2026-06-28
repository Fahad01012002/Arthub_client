"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const revenueData = [
  { month: "Jul", value: 4800 },
  { month: "Aug", value: 6500 },
  { month: "Sep", value: 5600 },
  { month: "Oct", value: 9600 },
  { month: "Nov", value: 8000 },
  { month: "Dec", value: 13000 },
];

const categoryData = [
  { name: "Painting", value: 28, color: "#d9a44e" },
  { name: "Illustration", value: 18, color: "#8aa654" },
  { name: "Sculpture", value: 12, color: "#c2603f" },
  { name: "Watercolor", value: 12, color: "#4a90d9" },
  { name: "Photography", value: 14, color: "#b56cb0" },
  { name: "Digital", value: 16, color: "#4f9d8d" },
];

// Soft pulsing ring on the last point (Dec) so the chart feels alive
function EndDot(props) {
  const { cx, cy, index } = props;
  if (index !== revenueData.length - 1) return null;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={5}
        className="revenue-pulse-ring"
        fill="none"
        stroke="#d9a44e"
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={4} fill="#d9a44e" stroke="#0a0908" strokeWidth={2} />
    </g>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-md border border-[#3a3530] bg-[#161310] px-3 py-2 shadow-xl">
      <p
        className="text-xs text-[#8b8680] mb-0.5"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        {label}
      </p>
      <p
        className="text-sm font-semibold text-[#d9a44e]"
        style={{ fontFamily: "var(--font-mono, monospace)" }}
      >
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function RevenueCharts() {
  return (
    <div className="bg-[#000000] mt-10">
      <style>{`
        @keyframes revenueFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes revenuePulseRing {
          0% { transform: scale(1); opacity: 0.8; }
          70% { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        .revenue-card {
          animation: revenueFadeUp 0.6s ease-out both;
        }
        .revenue-pulse-ring {
          transform-box: fill-box;
          transform-origin: center;
          animation: revenuePulseRing 2.2s ease-out infinite;
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Revenue */}
        <div className="revenue-card rounded-xl border border-[#2a2a2a] bg-[#000000] p-6">
          <h3
            className="text-xl font-bold text-[#f5f1ea] mb-6"
          >
            Monthly Revenue
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d9a44e" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#d9a44e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2520" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8b8680", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  ticks={[0, 4000, 7000, 11000, 14000]}
                  domain={[0, 14000]}
                  tickFormatter={(v) => `$${v / 1000}k`}
                  tick={{ fill: "#8b8680", fontSize: 12 }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#3a3530", strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#d9a44e"
                  strokeWidth={2.5}
                  fill="url(#revenueFill)"
                  dot={(props) => <EndDot {...props} />}
                  isAnimationActive
                  animationDuration={1800}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By Category */}
        <div className="revenue-card rounded-xl border border-[#252525] bg-[#000000] p-6" style={{ animationDelay: "150ms" }}>
          <h3
            className="text-xl font-bold text-[#f5f1ea] mb-6"
          >
            By Category
          </h3>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={1}
                  stroke="none"
                  isAnimationActive
                  animationDuration={1200}
                  animationBegin={200}
                  animationEasing="ease-out"
                >
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-6 mt-4">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-sm text-[#c7c2ba]">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}