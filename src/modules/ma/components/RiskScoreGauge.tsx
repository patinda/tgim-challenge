import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function RiskScoreGauge({ score }: { score: number }) {
  // Recharts veut un tableau de data
  const chartData = [{ name: 'Risque', value: score, fill: score < 40 ? '#22c55e' : score < 70 ? '#eab308' : '#ef4444' }];
  return (
    <div style={{ width: 220, height: 180 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          width={220}
          height={180}
          innerRadius="70%"
          outerRadius="100%"
          data={chartData}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            minAngle={15}
            background
            clockWise
            dataKey="value"
          />
          {/* Valeur numérique au centre */}
          <text x={110} y={120} textAnchor="middle" dominantBaseline="middle" fontSize={32} fill="#0f172a">
            {score}
          </text>
          <text x={110} y={145} textAnchor="middle" dominantBaseline="middle" fontSize={16} fill="#64748b">
            / 100
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
