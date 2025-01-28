import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalculatorSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: string;
  color?: string;
  description?: string;
}

export const CalculatorSection = ({
  title,
  children,
  className,
  icon,
  color = "white",
  description
}: CalculatorSectionProps) => {
  return (
    <Card className={cn("glass-card p-6 space-y-4", className)}>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {icon && (
            <img src={icon} alt={title} className="w-8 h-8 object-contain" />
          )}
          <h2 
            className="text-xl font-semibold neon-glow"
            style={{ color }}
          >
            {title}
          </h2>
        </div>
        {description && (
          <p className="text-sm text-gray-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
    </Card>
  );
};