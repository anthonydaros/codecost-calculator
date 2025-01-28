import { useState, useEffect } from "react";
import { CalculatorSection } from "./CalculatorSection";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const lovablePlans = [
  { name: "Free", messages: 5, price: 0 },
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

type DeploymentOption = "netlify" | "vercel" | "vps" | null;

export const PricingCalculator = () => {
  const { toast } = useToast();
  const [lovableTokens, setLovableTokens] = useState(100);
  const [recommendedPlan, setRecommendedPlan] = useState(lovablePlans[0]);
  const [selectedDeployment, setSelectedDeployment] = useState<DeploymentOption>(null);
  
  const [supabaseUsers, setSupabaseUsers] = useState(1000);
  const [supabaseRecords, setSupabaseRecords] = useState(100000);
  const [supabaseStorage, setSupabaseStorage] = useState(1);
  const [cursorPlan, setCursorPlan] = useState("Hobby");
  const [profitMargin, setProfitMargin] = useState(30);
  const [maintenancePercentage, setMaintenancePercentage] = useState(10);
  const [vpsPrice, setVpsPrice] = useState<number>(0);
  const [showInBRL, setShowInBRL] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(5); // Default exchange rate

  const calculateLovableCost = () => {
    return recommendedPlan.price;
  };

  const calculateSupabaseCost = () => {
    // Free tier limits
    const FREE_USERS = 50000;
    const FREE_STORAGE = 1; // 1GB
    const FREE_DATABASE = 0.5; // 500MB

    // Pro tier limits
    const PRO_USERS = 100000;
    const PRO_STORAGE = 100; // 100GB
    const PRO_DATABASE = 8; // 8GB

    // Additional costs
    const EXTRA_USER_COST = 0.00325;
    const EXTRA_STORAGE_COST = 0.021;
    const EXTRA_DATABASE_COST = 0.125;

    let totalCost = 0;

    // Calculate users cost
    if (supabaseUsers > FREE_USERS) {
      if (supabaseUsers > PRO_USERS) {
        const extraUsers = supabaseUsers - PRO_USERS;
        totalCost += 25 + (extraUsers * EXTRA_USER_COST); // Pro plan base + extra users
      } else {
        totalCost += 25; // Pro plan base cost
      }
    }

    // Calculate storage cost
    if (supabaseStorage > FREE_STORAGE) {
      if (supabaseStorage > PRO_STORAGE) {
        const extraStorage = supabaseStorage - PRO_STORAGE;
        totalCost += extraStorage * EXTRA_STORAGE_COST;
      } else if (supabaseStorage > FREE_STORAGE) {
        totalCost += 25; // Pro plan if exceeding free tier
      }
    }

    // Calculate database records cost (assuming 1GB ≈ 2.7M records with overhead)
    const recordsInGB = supabaseRecords / 2700000;
    if (recordsInGB > FREE_DATABASE) {
      if (recordsInGB > PRO_DATABASE) {
        const extraDB = recordsInGB - PRO_DATABASE;
        totalCost += extraDB * EXTRA_DATABASE_COST;
      } else if (recordsInGB > FREE_DATABASE) {
        totalCost += 25; // Pro plan if exceeding free tier
      }
    }

    return totalCost;
  };

  const calculateCursorCost = () => {
    switch (cursorPlan) {
      case "Pro":
        return 20;
      case "Business":
        return 40;
      default:
        return 0;
    }
  };

  const calculateDevelopmentCost = () => {
    return calculateLovableCost() + calculateCursorCost();
  };

  const calculateMonthlyCosts = () => {
    const supabaseMonthlyCost = calculateSupabaseCost();
    const maintenanceCost = (calculateDevelopmentCost() * maintenancePercentage) / 100;
    const deploymentCost = selectedDeployment === "vps" ? vpsPrice : 0;
    return supabaseMonthlyCost + maintenanceCost + deploymentCost;
  };

  const totalCost = () => {
    const developmentCost = calculateDevelopmentCost();
    const monthlyCosts = calculateMonthlyCosts();
    const totalWithoutMargin = developmentCost + monthlyCosts;
    return totalWithoutMargin * (1 + profitMargin / 100);
  };

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

  const getDeploymentContent = () => {
    switch (selectedDeployment) {
      case "netlify":
        return (
          <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-2">
            <h4 className="font-semibold">Netlify Free</h4>
            <p className="text-sm text-gray-400">
              Preço: Gratuito<br />
              Banda: 100 GB/mês<br />
              Builds: 300 min/mês<br />
              Sites: Até 500<br />
              Serverless: 125k invocações/mês<br />
              Edge Functions: 1M invocações/mês<br />
              Colaboração: 1 membro (Git ilimitado)<br />
              Extras: Pré-visualizações, reversões instantâneas
            </p>
          </div>
        );
      case "vercel":
        return (
          <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-2">
            <h4 className="font-semibold">Vercel Hobby</h4>
            <p className="text-sm text-gray-400">
              Preço: Gratuito<br />
              Banda: 100 GB/mês<br />
              Builds: 6.000 min/mês<br />
              Projetos: Até 200<br />
              Serverless: 100k invocações/mês<br />
              Edge Functions: 1M invocações/mês<br />
              Colaboração: Sem equipe<br />
              Extras: CI/CD, insights, mitigação DDoS, firewall
            </p>
          </div>
        );
      case "vps":
        return (
          <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-3">
            <h4 className="font-semibold">VPS Customizada</h4>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Custo mensal da VPS ($)</label>
              <Input
                type="number"
                min="0"
                value={vpsPrice}
                onChange={(e) => setVpsPrice(Number(e.target.value))}
                className="w-full"
                placeholder="Digite o valor mensal da VPS"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const calculateDevelopmentTotalWithMargin = () => {
    const developmentCost = calculateDevelopmentCost();
    return developmentCost * (1 + profitMargin / 100);
  };

  const calculateMonthlyTotalWithMargin = () => {
    const monthlyCosts = calculateMonthlyCosts();
    return monthlyCosts * (1 + profitMargin / 100);
  };

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setExchangeRate(data.rates.BRL);
      setShowInBRL(true);
      toast({
        title: "Cotação atualizada",
        description: `1 USD = ${data.rates.BRL} BRL`,
      });
    } catch (error) {
      toast({
        title: "Erro ao buscar cotação",
        description: "Usando taxa padrão de 5 BRL",
        variant: "destructive",
      });
      setExchangeRate(5);
      setShowInBRL(true);
    }
  };

  const formatCurrency = (value: number) => {
    if (showInBRL) {
      return `R$ ${(value * exchangeRate).toFixed(2)}`;
    }
    return `$${value.toFixed(2)}`;
  };

  const toggleCurrency = async () => {
    if (showInBRL) {
      setShowInBRL(false);
    } else {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRate(data.rates.BRL);
        setShowInBRL(true);
        toast({
          title: "Cotação atualizada",
          description: `1 USD = ${data.rates.BRL} BRL`,
        });
      } catch (error) {
        toast({
          title: "Erro ao buscar cotação",
          description: "Usando taxa padrão de 5 BRL",
          variant: "destructive",
        });
        setExchangeRate(5);
        setShowInBRL(true);
      }
    }
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
      Estime o custo do desenvolvimento do seu app no-code com Lovable.dev, Supabase e Cursor, ajustando os valores conforme suas necessidades.
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
                  Limite: {recommendedPlan.messages.toLocaleString()} mensagens
                  {recommendedPlan.price > 0 && ` + ${MONTHLY_BONUS_MESSAGES} mensagens bônus mensal`}
                </p>
                <p className="text-sm text-gray-400">
                  Preço: {formatCurrency(recommendedPlan.price)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Opções de Deploy:</p>
                <div className="flex gap-2">
                  <Button
                    variant={selectedDeployment === "netlify" ? "default" : "outline"}
                    onClick={() => setSelectedDeployment(selectedDeployment === "netlify" ? null : "netlify")}
                  >
                    Netlify
                  </Button>
                  <Button
                    variant={selectedDeployment === "vercel" ? "default" : "outline"}
                    onClick={() => setSelectedDeployment(selectedDeployment === "vercel" ? null : "vercel")}
                  >
                    Vercel
                  </Button>
                  <Button
                    variant={selectedDeployment === "vps" ? "default" : "outline"}
                    onClick={() => setSelectedDeployment(selectedDeployment === "vps" ? null : "vps")}
                  >
                    VPS
                  </Button>
                </div>
                {getDeploymentContent()}
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
                    <p className="text-lg font-semibold border-b border-white/10 pb-2">
                      Custos de Desenvolvimento (único)
                    </p>
                    <div className="space-y-2 mt-2">
                      <div>
                        <p className="text-sm text-gray-400">Lovable.dev</p>
                        <p className="text-lg">{formatCurrency(calculateLovableCost())}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Cursor</p>
                        <p className="text-lg">{formatCurrency(calculateCursorCost())}</p>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-sm text-gray-400">Total (com margem)</p>
                        <p className="text-lg font-bold neon-glow">
                          {formatCurrency(calculateDevelopmentTotalWithMargin())}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-6 shadow-[0_0_5px_rgba(255,255,255,0.5)] animate-pulse" />
                  
                  <div>
                    <p className="text-lg font-semibold border-b border-white/10 pb-2">
                      Custos Mensais
                    </p>
                    <div className="space-y-2 mt-2">
                      <div>
                        <p className="text-sm text-gray-400">Supabase</p>
                        <p className="text-lg">{formatCurrency(calculateSupabaseCost())}</p>
                      </div>
                      {maintenancePercentage > 0 && (
                        <div>
                          <p className="text-sm text-gray-400">Manutenção Sugerida</p>
                          <p className="text-lg">
                            {formatCurrency((calculateDevelopmentCost() * maintenancePercentage) / 100)}
                          </p>
                        </div>
                      )}
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-sm text-gray-400">Total (com margem)</p>
                        <p className="text-lg font-bold neon-glow">
                          {formatCurrency(calculateMonthlyTotalWithMargin())}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <Button
                      onClick={toggleCurrency}
                      className="flex items-center gap-2"
                      variant={showInBRL ? "default" : "outline"}
                    >
                      <img
                        src="https://flagcdn.com/w20/br.png"
                        alt="Bandeira do Brasil"
                        className="w-5 h-auto"
                      />
                      {showInBRL ? "Mostrar em USD" : "Mostrar em BRL"}
                    </Button>
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
