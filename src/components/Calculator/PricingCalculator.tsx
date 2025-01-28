import { useState } from "react";
import { CalculatorSection } from "./CalculatorSection";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const lovablePlans = [
  { name: "Starter", price: 0 },
  { name: "Launch", price: 49 },
  { name: "Scale 1", price: 99 },
  { name: "Teams", price: 199 },
];

export const PricingCalculator = () => {
  const [lovableTokens, setLovableTokens] = useState(1000);
  const [lovablePlan, setLovablePlan] = useState("Starter");
  const [supabaseUsers, setSupabaseUsers] = useState(100);
  const [supabaseStorage, setSupabaseStorage] = useState(1);
  const [cursorTokens, setCursorTokens] = useState(1000);
  const [cursorPlan, setCursorPlan] = useState("Hobby");
  const [profitMargin, setProfitMargin] = useState(30);

  const calculateLovableCost = () => {
    const plan = lovablePlans.find(p => p.name === lovablePlan);
    return plan?.price || 0;
  };

  const calculateSupabaseCost = () => {
    const basePrice = 25;
    const userCost = Math.max(0, supabaseUsers - 50000) * 0.00325;
    const storageCost = Math.max(0, supabaseStorage - 1) * 0.021;
    return basePrice + userCost + storageCost;
  };

  const calculateCursorCost = () => {
    const planPrices = {
      Hobby: 0,
      Pro: 20,
      Business: 40,
    };
    return planPrices[cursorPlan as keyof typeof planPrices];
  };

  const totalCost = () => {
    const base = calculateLovableCost() + calculateSupabaseCost() + calculateCursorCost();
    return base * (1 + profitMargin / 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 neon-glow">
        No-Code App Cost Calculator
      </h1>

      <CalculatorSection 
        title="Lovable.dev" 
        color="#646cff"
        icon="/placeholder.svg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Plan</label>
            <Select value={lovablePlan} onValueChange={setLovablePlan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lovablePlans.map(plan => (
                  <SelectItem key={plan.name} value={plan.name}>
                    {plan.name} (${plan.price}/mo)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm mb-2">
              Messages per month: {lovableTokens.toLocaleString()}
            </label>
            <Slider
              value={[lovableTokens]}
              onValueChange={([value]) => setLovableTokens(value)}
              max={100000}
              step={1000}
            />
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection 
        title="Supabase" 
        color="#3ECF8E"
        icon="/placeholder.svg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">
              Monthly Active Users: {supabaseUsers.toLocaleString()}
            </label>
            <Slider
              value={[supabaseUsers]}
              onValueChange={([value]) => setSupabaseUsers(value)}
              max={100000}
              step={1000}
            />
          </div>
          <div>
            <label className="block text-sm mb-2">
              Storage (GB): {supabaseStorage}
            </label>
            <Slider
              value={[supabaseStorage]}
              onValueChange={([value]) => setSupabaseStorage(value)}
              max={100}
              step={1}
            />
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection 
        title="Cursor" 
        color="#FF4D4D"
        icon="/placeholder.svg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Plan</label>
            <Select value={cursorPlan} onValueChange={setCursorPlan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hobby">Hobby ($0/mo)</SelectItem>
                <SelectItem value="Pro">Pro ($20/mo)</SelectItem>
                <SelectItem value="Business">Business ($40/mo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm mb-2">
              Tokens per month: {cursorTokens.toLocaleString()}
            </label>
            <Slider
              value={[cursorTokens]}
              onValueChange={([value]) => setCursorTokens(value)}
              max={100000}
              step={1000}
            />
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection title="Results" className="mt-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">
              Profit Margin: {profitMargin}%
            </label>
            <Slider
              value={[profitMargin]}
              onValueChange={([value]) => setProfitMargin(value)}
              max={100}
              step={1}
            />
          </div>
          <div className="pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Lovable.dev</p>
                <p className="text-lg">${calculateLovableCost()}/mo</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Supabase</p>
                <p className="text-lg">${calculateSupabaseCost().toFixed(2)}/mo</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Cursor</p>
                <p className="text-lg">${calculateCursorCost()}/mo</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total (with margin)</p>
                <p className="text-2xl font-bold neon-glow">
                  ${totalCost().toFixed(2)}/mo
                </p>
              </div>
            </div>
          </div>
        </div>
      </CalculatorSection>
    </div>
  );
};