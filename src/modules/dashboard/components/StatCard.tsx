import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { BookOpen, Trophy, CheckCircle } from 'lucide-react';

interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  change: string;
  color: string;
  index: number;
  className?: string;
}

const ICONS = {
  'BookOpen': BookOpen,
  'Trophy': Trophy,
  'CheckCircle': CheckCircle
};

export function StatCard({ icon, title, value, change, color, index, className = '' }: StatCardProps) {
  const Icon = ICONS[icon as keyof typeof ICONS];
  if (!Icon) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={className}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow duration-300 flex items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-lg">
          <Icon className={`h-10 w-10 ${color}`} />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-emerald-600 mt-1">{change}</p>
        </div>
      </Card>
    </motion.div>
  );
}