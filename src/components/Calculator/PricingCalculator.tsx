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

const DAILY_BONUS_MESSAGES = 5;
const DAYS_IN_MONTH = 30;
const MONTHLY_BONUS_MESSAGES = DAILY_BONUS_MESSAGES * DAYS_IN_MONTH;

export const PricingCalculator = () => {
  const [lovableTokens, setLovableTokens] = useState(100);
  const [recommendedPlan, setRecommendedPlan] = useState(lovablePlans[0]);
  const [supabaseUsers, setSupabaseUsers] = useState(100);
  const [supabaseRecords, setSupabaseRecords] = useState(1000000);
  const [supabaseStorage, setSupabaseStorage] = useState(1);
  const [cursorPlan, setCursorPlan] = useState("Hobby");
  const [profitMargin, setProfitMargin] = useState(30);
  const [maintenancePercentage, setMaintenancePercentage] = useState(10); // 10% default

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
    if (lovableTokens <= MONTHLY_BONUS_MESSAGES) return 0;
    return recommendedPlan.price;
  };

  const calculateSupabaseCost = () => {
    // Plano gratuito: até 50.000 usuários, 500MB storage, 500.000 registros
    const userCost = Math.max(0, supabaseUsers - 50000) * 0.00325;
    const storageCost = Math.max(0, supabaseStorage - 0.5) * 0.021;
    const recordsCost = Math.max(0, supabaseRecords - 500000) * 0.000001;
    
    // Se todos os valores estiverem dentro do limite gratuito, retorna 0
    if (supabaseUsers <= 50000 && supabaseStorage <= 0.5 && supabaseRecords <= 500000) {
      return 0;
    }
    
    // Caso contrário, calcula o custo com o plano Pro
    const basePrice = 25; // Preço base mensal do plano Pro
    return (basePrice + userCost + storageCost + recordsCost) * 12; // Custo anual
  };

  const calculateCursorCost = () => {
    const planPrices = {
      Hobby: 0,
      Pro: 20,
      Business: 40,
    };
    return planPrices[cursorPlan as keyof typeof planPrices];
  };

  const calculateDevelopmentCost = () => {
    return calculateLovableCost() + calculateCursorCost();
  };

  const calculateMonthlyCosts = () => {
    const supabaseMonthlyCost = calculateSupabaseCost() / 12;
    const maintenanceCost = (calculateDevelopmentCost() * maintenancePercentage) / 100;
    return supabaseMonthlyCost + maintenanceCost;
  };

  const totalCost = () => {
    const developmentCost = calculateDevelopmentCost();
    const monthlyTotal = calculateMonthlyCosts();
    return (developmentCost + (monthlyTotal * 12)) * (1 + profitMargin / 100);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
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

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 space-y-6">
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
                  Limite: {recommendedPlan.messages.toLocaleString()} mensagens + {MONTHLY_BONUS_MESSAGES} mensagens bônus mensal
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
            description="Plataforma de backend que fornece banco de dados, autenticação e armazenamento. O custo é baseado no número de usuários ativos, quantidade de registros no banco e armazenamento necessário para seu aplicativo. Este é um custo mensal recorrente para manter seu aplicativo funcionando."
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
                  Registros no Banco de Dados: {supabaseRecords.toLocaleString()}
                </label>
                <Slider
                  value={[supabaseRecords]}
                  onValueChange={([value]) => setSupabaseRecords(value)}
                  max={10000000}
                  step={100000}
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
            </div>
          </CalculatorSection>
        </div>

        <div className="col-span-1">
          <CalculatorSection title="Resultados" className="h-full">
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
              <div>
                <label className="block text-sm mb-2">
                  Manutenção Mensal: {maintenancePercentage}% do custo de desenvolvimento
                </label>
                <Slider
                  value={[maintenancePercentage]}
                  onValueChange={([value]) => setMaintenancePercentage(value)}
                  max={50}
                  step={1}
                />
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-semibold border-b border-white/10 pb-2">Custos de Desenvolvimento (único)</p>
                    <div className="space-y-2 mt-2">
                      <div>
                        <p className="text-sm text-gray-400">Lovable.dev</p>
                        <p className="text-lg">${calculateLovableCost()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Cursor</p>
                        <p className="text-lg">${calculateCursorCost()}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold border-b border-white/10 pb-2">Custos Mensais</p>
                    <div className="space-y-2 mt-2">
                      <div>
                        <p className="text-sm text-gray-400">Supabase</p>
                        <p className="text-lg">${(calculateSupabaseCost() / 12).toFixed(2)}</p>
                      </div>
                      {maintenancePercentage > 0 && (
                        <div>
                          <p className="text-sm text-gray-400">Manutenção Sugerida</p>
                          <p className="text-lg">${((calculateDevelopmentCost() * maintenancePercentage) / 100).toFixed(2)}</p>
                        </div>
                      )}
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-sm text-gray-400">Total Mensal</p>
                        <p className="text-lg font-bold">${calculateMonthlyCosts().toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
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
      </div>
    </div>
  );
};

export default PricingCalculator;