import {
  Type,
  Image as ImageIcon,
  Code,
  Sparkles,
  Cpu,
  DollarSign,
  FileText,
  ALargeSmall,
  Minimize2,
  RefreshCw,
  CodeXml,
  KeyRound,
  Video,
  Hash,
  UserCheck,
  Calculator,
  TrendingUp,
  FileSpreadsheet,
  Search,
  Moon,
  Sun,
  Heart,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Check,
  Trash2,
  Zap,
  Clock,
  CheckCircle2,
  HelpCircle,
  Info
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<any>> = {
  // Categories
  Type,
  Image: ImageIcon,
  Code,
  Sparkles,
  Cpu,
  DollarSign,

  // Tools
  FileText,
  ALargeSmall,
  Minimize2,
  RefreshCw,
  CodeXml,
  KeyRound,
  Video,
  Hash,
  UserCheck,
  Calculator,
  TrendingUp,
  FileSpreadsheet,

  // General UI
  Search,
  Moon,
  Sun,
  Heart,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Check,
  CheckCircle2,
  HelpCircle,
  Info,
  Trash2,
  Zap,
  Clock
};

interface IconProps {
  name: string;
  className?: string;
  [key: string]: any;
}

export default function Icon({ name, className, ...props }: IconProps) {
  const Comp = iconMap[name];
  if (!Comp) {
    return <Zap className={className} {...props} />; // Fallback icon
  }
  return <Comp className={className} {...props} />;
}
