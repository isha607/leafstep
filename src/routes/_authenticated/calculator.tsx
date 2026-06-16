import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CarbonCalculator } from "@/components/CarbonCalculator";
import { useAuth } from "@/hooks/use-auth";
import { setStoredFootprint } from "@/lib/leafstep-storage";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/calculator")({
  component: CalculatorPage,
});

function CalculatorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleComplete(result: {
    transport: number;
    diet: number;
    energy: number;
    shopping: number;
    total: number;
  }) {
    if (!user) return;
    setStoredFootprint(user.id, result);
    toast.success("Footprint calculated! Taking you to your dashboard 🌱");
    setTimeout(() => navigate({ to: "/dashboard", replace: true }), 800);
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div className="animate-slide-up">
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
          Carbon Calculator
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Answer 4 quick questions to see your personal footprint
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 animate-slide-up">
        {[
          { val: "10t",  lbl: "Global avg/person" },
          { val: "1.9t", lbl: "India avg/person"  },
          { val: "0.5t", lbl: "2050 target"       },
        ].map(s => (
          <div key={s.lbl} className="ls-card p-3 text-center">
            <div className="text-lg font-extrabold text-primary">{s.val}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{s.lbl}</div>
          </div>
        ))}
      </div>
      <CarbonCalculator onComplete={handleComplete} />
    </div>
  );
}