import { Check } from "lucide-react";

interface StepBarProps {
  steps: string[];
  current: number;
}

const StepBar = ({ steps, current }: StepBarProps) => {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                i < current
                  ? "bg-crm-blue border-crm-blue text-primary-foreground"
                  : i === current
                  ? "bg-crm-blue border-crm-blue text-primary-foreground"
                  : "border-crm-border bg-card text-muted-foreground"
              }`}
            >
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 ${i <= current ? "text-crm-blue font-medium" : "text-muted-foreground"}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-1 mt-[-12px] ${i < current ? "bg-crm-blue" : "bg-crm-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepBar;
