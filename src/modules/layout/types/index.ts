import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  count?: string;
  status?: string;
  path?: string;
  disabled?: boolean;
  className?: string;
}