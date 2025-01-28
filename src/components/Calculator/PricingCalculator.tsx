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
      <div className="flex justify-center items-center gap-8 mb-12">
        <img src="/lovable icon.svg" alt="Lovable" className="w-16 h-16" />
        <img src="/supabase-logo-icon.svg" alt="Supabase" className="w-16 h-16" />
        <img src="/cursor logo.png" alt="Cursor" className="w-16 h-16" />
      </div>

      <h1 className="text-3xl font-bold text-center mb-4 neon-glow">
        Calculadora de Custo para Apps No-Code
      </h1>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-8">
        Esta calculadora ajuda você a estimar o custo total para desenvolver seu aplicativo usando ferramentas no-code. 
        Ajuste os valores de acordo com suas necessidades para obter uma estimativa precisa do investimento necessário.
        O cálculo é baseado no uso combinado das três principais ferramentas: Lovable.dev para desenvolvimento, Supabase para backend, e Cursor para refinamentos.
      </p>

      <CalculatorSection 
        title="Lovable.dev" 
        color="#646cff"
        icon="/lovable icon.svg"
        description="Plataforma principal para desenvolvimento do aplicativo. Permite criar interfaces completas e funcionais usando IA. O custo é baseado no número de mensagens necessárias para desenvolver seu app - quanto mais complexo, mais mensagens serão necessárias."
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
        icon="/supabase-logo-icon.svg"
        description="Plataforma de backend que fornece banco de dados, autenticação e armazenamento. O custo é baseado no número de usuários ativos e quantidade de armazenamento necessário para seu aplicativo."
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
        icon="/cursor logo.png"
        description="Editor de código com IA para fazer ajustes e refinamentos no frontend e backend. Ideal para pequenas alterações como mudança de cores e textos, sendo mais econômico que usar o Lovable para essas tarefas. Também é eficiente para desenvolvimento backend por executar códigos mais complexos. Disponível gratuitamente com 2000 completions e 50 requisições premium lentas, ou em planos pagos com recursos adicionais."
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