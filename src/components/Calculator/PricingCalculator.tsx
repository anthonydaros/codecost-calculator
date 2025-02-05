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
import { DollarSign, Euro, Globe, Languages } from "lucide-react";

type CurrencyOption = "USD" | "BRL" | "EUR";
type LanguageOption = "pt" | "en" | "es" | "it" | "fr" | "de" | "hi" | "zh";

interface ExchangeRates {
  BRL: number;
  EUR: number;
}

const languageMap = {
  pt: { name: "Português", code: "pt" },
  en: { name: "English", code: "en" },
  es: { name: "Español", code: "es" },
  it: { name: "Italiano", code: "it" },
  fr: { name: "Français", code: "fr" },
  de: { name: "Deutsch", code: "de" },
  hi: { name: "हिन्दी", code: "hi" },
  zh: { name: "中文", code: "zh" },
};

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

export const PricingCalculator = () => {
  const { toast } = useToast();
  const [lovableTokens, setLovableTokens] = useState(100);
  const [recommendedPlan, setRecommendedPlan] = useState(lovablePlans[0]);
  const [selectedDeployment, setSelectedDeployment] = useState<DeploymentOption>(null);
  
  const [supabaseUsers, setSupabaseUsers] = useState(50000);
  const [supabaseRecords, setSupabaseRecords] = useState(1300000);
  const [supabaseStorage, setSupabaseStorage] = useState(1);
  const [cursorPlan, setCursorPlan] = useState("Hobby");
  const [profitMargin, setProfitMargin] = useState(30);
  const [maintenancePercentage, setMaintenancePercentage] = useState(10);
  const [vpsPrice, setVpsPrice] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>("USD");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>("pt");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    BRL: 5,
    EUR: 0.85,
  });

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(response => response.json())
      .then(data => {
        setExchangeRates({
          BRL: data.rates.BRL,
          EUR: data.rates.EUR,
        });
        toast({
          title: "Cotações atualizadas",
          description: `USD/BRL: ${data.rates.BRL.toFixed(2)} | USD/EUR: ${data.rates.EUR.toFixed(2)}`,
        });
      })
      .catch(() => {
        toast({
          title: "Erro ao atualizar cotações",
          description: "Usando valores padrão",
          variant: "destructive",
        });
      });
  }, [toast]);

  const formatCurrency = (value: number): string => {
    const formatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

    switch (selectedCurrency) {
      case "BRL":
        return new Intl.NumberFormat('pt-BR', formatOptions).format(value * exchangeRates.BRL);
      case "EUR":
        return new Intl.NumberFormat('de-DE', formatOptions).format(value * exchangeRates.EUR);
      default:
        return new Intl.NumberFormat('en-US', formatOptions).format(value);
    }
  };

  const calculateLovableCost = () => {
    return recommendedPlan.price;
  };

  const calculateSupabaseCost = () => {
    const FREE_USERS = 50000;
    const FREE_STORAGE = 1; // 1GB
    const FREE_DATABASE = 0.5; // 500MB
    const FREE_BANDWIDTH = 5; // 5GB

    const PRO_USERS = 100000;
    const PRO_STORAGE = 100; // 100GB
    const PRO_DATABASE = 8; // 8GB
    const PRO_BANDWIDTH = 25; // 25GB

    const EXTRA_USER_COST = 0.00325; // per user
    const EXTRA_STORAGE_COST = 0.021; // per GB
    const EXTRA_DATABASE_COST = 0.125; // per GB
    const EXTRA_BANDWIDTH_COST = 0.09; // per GB

    let totalCost = 0;
    const recordsInGB = supabaseRecords / 2700000; // Convert records to GB
    
    const estimatedBandwidth = Math.ceil(recordsInGB);

    const needsProPlan = 
      supabaseUsers > FREE_USERS ||
      supabaseStorage > FREE_STORAGE ||
      recordsInGB > FREE_DATABASE ||
      estimatedBandwidth > FREE_BANDWIDTH;

    if (needsProPlan) {
      totalCost += 25; // Base Pro Plan cost

      if (estimatedBandwidth > PRO_DATABASE) {
        const extraBandwidth = estimatedBandwidth - PRO_DATABASE;
        totalCost += extraBandwidth * EXTRA_BANDWIDTH_COST;
      }
    }

    if (supabaseUsers > PRO_USERS) {
      const extraUsers = supabaseUsers - PRO_USERS;
      totalCost += extraUsers * EXTRA_USER_COST;
    }

    if (supabaseStorage > PRO_STORAGE) {
      const extraStorage = supabaseStorage - PRO_STORAGE;
      totalCost += extraStorage * EXTRA_STORAGE_COST;
    }

    if (recordsInGB > PRO_DATABASE) {
      const extraDB = recordsInGB - PRO_DATABASE;
      totalCost += extraDB * EXTRA_DATABASE_COST;
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

  const formatStorageSize = (records: number): string => {
    const sizeInGB = records / 2700000;
    if (sizeInGB < 1) {
      return `${(sizeInGB * 1024).toFixed(2)} MB`;
    }
    return `${sizeInGB.toFixed(2)} GB`;
  };

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
    const supabaseCost = calculateSupabaseCost();
    const maintenanceCost = (calculateDevelopmentCost() * maintenancePercentage) / 100;
    const deploymentCost = selectedDeployment === "vps" ? vpsPrice : 0;
    return supabaseCost + maintenanceCost + deploymentCost;
  };

  const handleLanguageChange = (language: LanguageOption) => {
    const currentUrl = window.location.origin;
    const targetLang = languageMap[language].code;
    const translateUrl = `https://${window.location.hostname.replace("www.", "")}--calculator-lovable-app.translate.goog/?_x_tr_sl=auto&_x_tr_tl=${targetLang}&_x_tr_hl=pt-BR&_x_tr_pto=wapp`;
    window.location.href = translateUrl;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <div className="flex justify-center items-center gap-8 mb-12">
        <img src="/lovable icon.svg" alt="Lovable" className="w-16 h-16" />
        <img src="/supabase-logo-icon.svg" alt="Supabase" className="w-16 h-16" />
        <img src="/cursor logo.png" alt="Cursor" className="w-16 h-16" />
      </div>

      <h1 className="text-3xl font-bold text-center mb-4 neon-glow">
        {translations[selectedLanguage].title}
      </h1>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-8">
        {translations[selectedLanguage].description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <CalculatorSection 
            title="Lovable.dev" 
            color="#646cff"
            icon="/lovable icon.svg"
            description={translations[selectedLanguage].lovableSection}
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
            description={translations[selectedLanguage].supabaseSection}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">
                  Usuários Ativos Mensais: {supabaseUsers.toLocaleString()}
                </label>
                <Slider
                  value={[supabaseUsers]}
                  onValueChange={([value]) => setSupabaseUsers(value)}
                  max={750000}
                  step={10000}
                />
              </div>
              <div>
                <label className="block text-sm mb-2">
                  Registros no Banco de Dados: {supabaseRecords.toLocaleString()} ({formatStorageSize(supabaseRecords)})
                </label>
                <Slider
                  value={[supabaseRecords]}
                  onValueChange={([value]) => setSupabaseRecords(value)}
                  max={135000000} // 50GB worth of records (2.7M records per GB * 50)
                  step={500000}
                />
              </div>
              <div>
                <label className="block text-sm mb-2">
                  Armazenamento: {supabaseStorage} GB
                </label>
                <Slider
                  value={[supabaseStorage]}
                  onValueChange={([value]) => setSupabaseStorage(value)}
                  max={1024}
                  min={1}
                  step={1}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {supabaseStorage <= 1 && "Grátis até 1GB"}
                  {supabaseStorage > 1 && supabaseStorage <= 100 && "Plano Pro ($25/mês até 100GB)"}
                  {supabaseStorage > 100 && `$0.021 por GB adicional após 100GB`}
                </p>
              </div>
              <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-2">
                <p className="text-sm text-gray-400">Largura de Banda Estimada:</p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    Free Plan: 5 GB bandwidth
                  </p>
                  <p className="text-xs text-gray-500">
                    Pro Plan ({formatCurrency(25)}): 25 GB bandwidth + {formatCurrency(0.09)} por GB adicional após 8GB
                  </p>
                  <p className="text-sm font-medium">
                    Estimativa atual: {Math.ceil(supabaseRecords / 2700000)} GB
                  </p>
                </div>
              </div>
            </div>
          </CalculatorSection>

          <CalculatorSection 
            title="Cursor" 
            color="#FF4D4D"
            icon="/cursor logo.png"
            description={translations[selectedLanguage].cursorSection}
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
                  {translations[selectedLanguage].profitMargin}: {profitMargin}%
                </label>
                <Slider
                  value={[profitMargin]}
                  onValueChange={([value]) => setProfitMargin(value)}
                  max={500}
                  step={10}
                />
              </div>
              <div>
                <label className="block text-sm mb-2">
                  {translations[selectedLanguage].monthlyMaintenance}: {maintenancePercentage}%
                </label>
                <Slider
                  value={[maintenancePercentage]}
                  onValueChange={([value]) => setMaintenancePercentage(value)}
                  max={300}
                  step={5}
                />
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-semibold border-b border-white/10 pb-2">
                      {translations[selectedLanguage].developmentCosts}
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
                        <p className="text-sm text-gray-400">{translations[selectedLanguage].totalWithMargin}</p>
                        <p className="text-lg font-bold neon-glow">
                          {formatCurrency(calculateDevelopmentTotalWithMargin())}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-6 shadow-[0_0_5px_rgba(255,255,255,0.5)] animate-pulse" />
                  
                  <div>
                    <p className="text-lg font-semibold border-b border-white/10 pb-2">
                      {translations[selectedLanguage].monthlyCosts}
                    </p>
                    <div className="space-y-2 mt-2">
                      <div>
                        <p className="text-sm text-gray-400">Supabase</p>
                        <p className="text-lg">{formatCurrency(calculateSupabaseCost())}</p>
                      </div>
                      {maintenancePercentage > 0 && (
                        <div>
                          <p className="text-sm text-gray-400">{translations[selectedLanguage].maintenance} {translations[selectedLanguage].suggested}</p>
                          <p className="text-lg">
                            {formatCurrency((calculateDevelopmentCost() * maintenancePercentage) / 100)}
                          </p>
                        </div>
                      )}
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-sm text-gray-400">{translations[selectedLanguage].total}</p>
                        <p className="text-lg font-bold neon-glow">
                          {formatCurrency(calculateMonthlyTotalWithMargin())}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                    <div className="flex gap-2">
                      <Select
                        value={selectedCurrency}
                        onValueChange={(value: CurrencyOption) => setSelectedCurrency(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              USD
                            </div>
                          </SelectItem>
                          <SelectItem value="BRL">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">R$</span>
                              BRL
                            </div>
                          </SelectItem>
                          <SelectItem value="EUR">
                            <div className="flex items-center gap-2">
                              <Euro className="w-4 h-4" />
                              EUR
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedLanguage}
                        onValueChange={(value: LanguageOption) => handleLanguageChange(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              Português
                            </div>
                          </SelectItem>
                          <SelectItem value="en">
                            <div className="flex items-center gap-2">
                              <Languages className="w-4 h-4" />
                              English
                            </div>
                          </SelectItem>
                          <SelectItem value="es">
                            <div className="flex items-center gap-2">
                              <Languages className="w-4 h-4" />
                              Español
                            </div>
                          </SelectItem>
                          <SelectItem value="it">
                            <div className="flex items-center gap-2">
                              <Languages className="w-4 h-4" />
                              Italiano
                            </div>
                          </SelectItem>
                          <SelectItem value="fr">
                            <div className="flex items-center gap-2">
                              <Languages className="w-4 h-4" />
                              Français
                            </div>
                          </SelectItem>
                          <SelectItem value="de">
                            <div className="flex items-center gap-2">
                              <Languages className="w-4 h-4" />
                              Deutsch
                            </div>
                          </SelectItem>
                          <SelectItem value="hi">
                            <div className="flex items-center gap-2">
                              <Languages className="w-4 h-4" />
                              हिन्दी
                            </div>
                          </SelectItem>
                          <SelectItem value="zh">
                            <div className="flex items-center gap-2">
                              <Languages className="w-4 h-4" />
                              中文
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedCurrency !== "USD" && (
                      <p className="text-xs text-gray-400 text-center">
                        Cotação: USD 1 = {selectedCurrency === "BRL" 
                          ? `R$ ${exchangeRates.BRL.toFixed(2)}` 
                          : `€ ${exchangeRates.EUR.toFixed(2)}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CalculatorSection>
        </div>
      </div>
      <footer className="mt-12 text-center text-gray-400">
        Desenvolvido por Anthony Max
      </footer>
    </div>
  );
};

export default PricingCalculator;
