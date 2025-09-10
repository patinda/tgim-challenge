import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export type ValuationHistoryEntry = {
  date: string; // e.g. ISO string
  min: number;
  max: number;
};

export default function ValuationHistoryChart({ data }: { data: ValuationHistoryEntry[] }) {
  // Pour affichage lisible sur l'axe X, format la date ici
  const parsedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('fr-FR'),
  }));

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width={"100%"} height={240}>
        <LineChart data={parsedData} margin={{ top: 10, right: 24, left: 24, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="min" stroke="#8884d8" name="Min Valo" dot={false} />
          <Line type="monotone" dataKey="max" stroke="#60a5fa" name="Max Valo" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
