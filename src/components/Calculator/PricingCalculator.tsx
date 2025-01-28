import { useState, useEffect } from "react";
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
  { name: "Starter", messages: 100, price: 20 },
  { name: "Launch", messages: 250, price: 50 },
  { name: "Scale 1", messages: 500, price: 100 },
  { name: "Scale 2", messages: 1000, price: 200 },
  { name: "Scale 3", messages: 1500, price: 294 },
  { name: "Scale 4", messages: 2000, price: 384 },
  { name: "Scale 5", messages: 3000, price: 564 },
  { name: "Scale 6", messages: 4000, price: 736 },
  { name: "Scale 7", messages: 5000, price: 900 },
];

export const PricingCalculator = () => {
  const [lovableTokens, setLovableTokens] = useState(100);
  const [recommendedPlan, setRecommendedPlan] = useState(lovablePlans[0]);
  const [supabaseUsers, setSupabaseUsers] = useState(100);
  const [supabaseStorage, setSupabaseStorage] = useState(1);
  const [cursorTokens, setCursorTokens] = useState(1000);
  const [cursorPlan, setCursorPlan] = useState("Hobby");
  const [profitMargin, setProfitMargin] = useState(30);

  useEffect(() => {
    // Find the most cost-effective plan for the selected number of tokens
    const appropriatePlan = lovablePlans.reduce((prev, curr) => {
      if (lovableTokens <= curr.messages && 
          (prev.messages > curr.messages || prev.messages < lovableTokens)) {
        return curr;
      }
      return prev;
    }, lovablePlans[0]);
    
    setRecommendedPlan(appropriatePlan);
  }, [lovableTokens]);

  const calculateLovableCost = () => {
    return recommendedPlan.price;
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
        Calculadora de Custo para Apps No-Code
      </h1>

      <CalculatorSection 
        title="Lovable.dev" 
        color="#646cff"
        icon="/placeholder.svg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">
              Mensagens necessárias: {lovableTokens.toLocaleString()}
            </label>
            <Slider
              value={[lovableTokens]}
              onValueChange={([value]) => setLovableTokens(value)}
              max={5000}
              step={50}
            />
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-sm text-gray-300">Plano Recomendado:</p>
            <p className="text-lg font-semibold">{recommendedPlan.name}</p>
            <p className="text-sm text-gray-400">
              Limite: {recommendedPlan.messages.toLocaleString()} mensagens
            </p>
            <p className="text-sm text-gray-400">
              Preço: ${recommendedPlan.price}
            </p>
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
              Usuários Ativos Mensais: {supabaseUsers.toLocaleString()}
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
              Armazenamento (GB): {supabaseStorage}
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
            <label className="block text-sm mb-2">Plano</label>
            <Select value={cursorPlan} onValueChange={setCursorPlan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hobby">Hobby (Grátis)</SelectItem>
                <SelectItem value="Pro">Pro ($20/mês)</SelectItem>
                <SelectItem value="Business">Business ($40/mês)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm mb-2">
              Tokens por mês: {cursorTokens.toLocaleString()}
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

      <CalculatorSection title="Resultados" className="mt-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">
              Margem de Lucro: {profitMargin}%
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
                <p className="text-lg">${calculateLovableCost()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Supabase</p>
                <p className="text-lg">${calculateSupabaseCost().toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Cursor</p>
                <p className="text-lg">${calculateCursorCost()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total (com margem)</p>
                <p className="text-2xl font-bold neon-glow">
                  ${totalCost().toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CalculatorSection>
    </div>
  );
};