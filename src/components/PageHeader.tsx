import { Search, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  onSearch?: () => void;
  action?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export default function PageHeader({ title, subtitle, icon: Icon, onSearch, action, showBack, onBack }: PageHeaderProps) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) return onBack();
    if (window.history.length > 1) navigate(-1);
    else navigate("/chat");
  };
  return (
    <div className="px-5 pt-6 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={handleBack}
              aria-label="Back"
              className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center hover:bg-muted/60 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
          )}
          {Icon && <Icon className="w-6 h-6 text-primary" />}
          <div>
            <h1 className="text-xl font-bold font-serif">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onSearch && (
            <button
              onClick={onSearch}
              className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          {action}
        </div>
      </div>
    </div>
  );
}
