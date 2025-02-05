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
type LanguageOption = "en" | "pt" | "es" | "it" | "fr" | "de" | "hi" | "zh";

interface ExchangeRates {
  BRL: number;
  EUR: number;
}

interface TranslationMap {
  [key: string]: {
    title: string;
    description: string;
    lovableSection: string;
    supabaseSection: string;
    cursorSection: string;
    results: string;
    profitMargin: string;
    monthlyMaintenance: string;
    developmentCosts: string;
    monthlyCosts: string;
    total: string;
    totalWithMargin: string;
    maintenance: string;
    suggested: string;
    requiredMessages: string;
    recommendedPlan: string;
    limit: string;
    price: string;
    monthlyBonus: string;
    messages: string;
    deploymentOptions: string;
    storageSize: string;
    bandwidth: string;
    estimatedBandwidth: string;
    freePlan: string;
    proPlan: string;
    monthlyPrice: string;
    monthlyBandwidth: string;
    builds: string;
    sites: string;
    serverless: string;
    edgeFunctions: string;
    collaboration: string;
    extras: string;
    vpsMonthlyPrice: string;
    enterVpsPrice: string;
    monthlyVpsCost: string;
  };
}

const translations: TranslationMap = {
  en: {
    title: "No-Code App Cost Calculator",
    description: "Estimate the cost of developing your no-code app with Lovable.dev, Supabase and Cursor, adjusting the values according to your needs.",
    lovableSection: "Main platform for application development",
    supabaseSection: "Backend platform that provides database",
    cursorSection: "AI code editor",
    results: "Results",
    profitMargin: "Profit Margin",
    monthlyMaintenance: "Monthly Maintenance",
    developmentCosts: "Development Costs (one-time)",
    monthlyCosts: "Monthly Costs",
    total: "Total",
    totalWithMargin: "Total (with margin)",
    maintenance: "Maintenance",
    suggested: "Suggested",
    requiredMessages: "Required Messages",
    recommendedPlan: "Recommended Plan",
    limit: "Limit",
    price: "Price",
    monthlyBonus: "monthly bonus messages",
    messages: "messages",
    deploymentOptions: "Deployment Options",
    storageSize: "Storage Size",
    bandwidth: "Bandwidth",
    estimatedBandwidth: "Current Estimate",
    freePlan: "Free Plan",
    proPlan: "Pro Plan",
    monthlyPrice: "Monthly Price",
    monthlyBandwidth: "Monthly Bandwidth",
    builds: "Builds",
    sites: "Sites",
    serverless: "Serverless",
    edgeFunctions: "Edge Functions",
    collaboration: "Collaboration",
    extras: "Extras",
    vpsMonthlyPrice: "VPS Monthly Cost ($)",
    enterVpsPrice: "Enter VPS monthly cost",
    monthlyVpsCost: "Monthly VPS Cost",
  },
  pt: {
    title: "Calculadora de Custo para Apps No-Code",
    description: "Estime o custo do desenvolvimento do seu app no-code com Lovable.dev, Supabase e Cursor, ajustando os valores conforme suas necessidades.",
    lovableSection: "Plataforma principal para desenvolvimento do aplicativo",
    supabaseSection: "Plataforma de backend que fornece banco de dados",
    cursorSection: "Editor de código com IA",
    results: "Resultados",
    profitMargin: "Margem de Lucro",
    monthlyMaintenance: "Manutenção Mensal",
    developmentCosts: "Custos de Desenvolvimento (único)",
    monthlyCosts: "Custos Mensais",
    total: "Total",
    totalWithMargin: "Total (com margem)",
    maintenance: "Manutenção",
    suggested: "Sugerida",
    requiredMessages: "Mensagens Necessárias",
    recommendedPlan: "Plano Recomendado",
    limit: "Limite",
    price: "Preço",
    monthlyBonus: "mensagens bônus mensal",
    messages: "mensagens",
    deploymentOptions: "Opções de Deploy",
    storageSize: "Tamanho do Armazenamento",
    bandwidth: "Largura de Banda",
    estimatedBandwidth: "Estimativa Atual",
    freePlan: "Plano Gratuito",
    proPlan: "Plano Pro",
    monthlyPrice: "Preço Mensal",
    monthlyBandwidth: "Banda Mensal",
    builds: "Builds",
    sites: "Sites",
    serverless: "Serverless",
    edgeFunctions: "Edge Functions",
    collaboration: "Colaboração",
    extras: "Extras",
    vpsMonthlyPrice: "Custo Mensal da VPS ($)",
    enterVpsPrice: "Digite o valor mensal da VPS",
    monthlyVpsCost: "Custo Mensal da VPS",
  },
  es: {
    title: "Calculadora de Costos para Apps No-Code",
    description: "Estime el costo de desarrollo de su aplicación no-code con Lovable.dev, Supabase y Cursor, ajustando los valores según sus necesidades.",
    lovableSection: "Plataforma principal para desarrollo de aplicaciones",
    supabaseSection: "Plataforma backend que proporciona base de datos",
    cursorSection: "Editor de código con IA",
    results: "Resultados",
    profitMargin: "Margen de Beneficio",
    monthlyMaintenance: "Mantenimiento Mensual",
    developmentCosts: "Costos de Desarrollo (único)",
    monthlyCosts: "Costos Mensuales",
    total: "Total",
    totalWithMargin: "Total (con margen)",
    maintenance: "Mantenimiento",
    suggested: "Sugerido",
    requiredMessages: "Mensajes Requeridos",
    recommendedPlan: "Plan Recomendado",
    limit: "Límite",
    price: "Precio",
    monthlyBonus: "mensajes de bonificación mensual",
    messages: "mensajes",
    deploymentOptions: "Opciones de Implementación",
    storageSize: "Tamaño de Almacenamiento",
    bandwidth: "Ancho de Banda",
    estimatedBandwidth: "Estimación Actual",
    freePlan: "Plan Gratuito",
    proPlan: "Plan Pro",
    monthlyPrice: "Precio Mensual",
    monthlyBandwidth: "Banda Mensual",
    builds: "Compilaciones",
    sites: "Sitios",
    serverless: "Serverless",
    edgeFunctions: "Edge Functions",
    collaboration: "Colaboración",
    extras: "Extras",
    vpsMonthlyPrice: "Costo Mensual del VPS ($)",
    enterVpsPrice: "Ingrese el costo mensual del VPS",
    monthlyVpsCost: "Costo Mensual del VPS",
  },
  it: {
    title: "Calcolatore di Costi per App No-Code",
    description: "Stima il costo di sviluppo della tua app no-code con Lovable.dev, Supabase e Cursor, regolando i valori in base alle tue esigenze.",
    lovableSection: "Piattaforma principale per lo sviluppo di applicazioni",
    supabaseSection: "Piattaforma backend che fornisce database",
    cursorSection: "Editor di codice con IA",
    results: "Risultati",
    profitMargin: "Margine di Profitto",
    monthlyMaintenance: "Manutenzione Mensile",
    developmentCosts: "Costi di Sviluppo (una tantum)",
    monthlyCosts: "Costi Mensili",
    total: "Totale",
    totalWithMargin: "Totale (con margine)",
    maintenance: "Manutenzione",
    suggested: "Suggerito",
    requiredMessages: "Messaggi Richiesti",
    recommendedPlan: "Piano Consigliato",
    limit: "Limite",
    price: "Prezzo",
    monthlyBonus: "messaggi bonus mensili",
    messages: "messaggi",
    deploymentOptions: "Opzioni di Deployment",
    storageSize: "Dimensione Archiviazione",
    bandwidth: "Larghezza di Banda",
    estimatedBandwidth: "Stima Attuale",
    freePlan: "Piano Gratuito",
    proPlan: "Piano Pro",
    monthlyPrice: "Prezzo Mensile",
    monthlyBandwidth: "Banda Mensile",
    builds: "Build",
    sites: "Siti",
    serverless: "Serverless",
    edgeFunctions: "Edge Functions",
    collaboration: "Collaborazione",
    extras: "Extra",
    vpsMonthlyPrice: "Costo Mensile VPS ($)",
    enterVpsPrice: "Inserisci il costo mensile VPS",
    monthlyVpsCost: "Costo Mensile VPS",
  },
  fr: {
    title: "Calculateur de Coûts pour Apps No-Code",
    description: "Estimez le coût de développement de votre application no-code avec Lovable.dev, Supabase et Cursor, en ajustant les valeurs selon vos besoins.",
    lovableSection: "Plateforme principale pour le développement d'applications",
    supabaseSection: "Plateforme backend fournissant une base de données",
    cursorSection: "Éditeur de code avec IA",
    results: "Résultats",
    profitMargin: "Marge Bénéficiaire",
    monthlyMaintenance: "Maintenance Mensuelle",
    developmentCosts: "Coûts de Développement (unique)",
    monthlyCosts: "Coûts Mensuels",
    total: "Total",
    totalWithMargin: "Total (avec marge)",
    maintenance: "Maintenance",
    suggested: "Suggéré",
    requiredMessages: "Messages Requis",
    recommendedPlan: "Plan Recommandé",
    limit: "Limite",
    price: "Prix",
    monthlyBonus: "messages bonus mensuels",
    messages: "messages",
    deploymentOptions: "Options de Déploiement",
    storageSize: "Taille de Stockage",
    bandwidth: "Bande Passante",
    estimatedBandwidth: "Estimation Actuelle",
    freePlan: "Plan Gratuit",
    proPlan: "Plan Pro",
    monthlyPrice: "Prix Mensuel",
    monthlyBandwidth: "Bande Passante Mensuelle",
    builds: "Builds",
    sites: "Sites",
    serverless: "Serverless",
    edgeFunctions: "Edge Functions",
    collaboration: "Collaboration",
    extras: "Extras",
    vpsMonthlyPrice: "Coût Mensuel VPS ($)",
    enterVpsPrice: "Entrez le coût mensuel VPS",
    monthlyVpsCost: "Coût Mensuel VPS",
  },
  de: {
    title: "Kostenrechner für No-Code Apps",
    description: "Schätzen Sie die Entwicklungskosten Ihrer No-Code-App mit Lovable.dev, Supabase und Cursor, indem Sie die Werte nach Ihren Bedürfnissen anpassen.",
    lovableSection: "Hauptplattform für Anwendungsentwicklung",
    supabaseSection: "Backend-Plattform, die Datenbank bereitstellt",
    cursorSection: "KI-Code-Editor",
    results: "Ergebnisse",
    profitMargin: "Gewinnspanne",
    monthlyMaintenance: "Monatliche Wartung",
    developmentCosts: "Entwicklungskosten (einmalig)",
    monthlyCosts: "Monatliche Kosten",
    total: "Gesamt",
    totalWithMargin: "Gesamt (mit Marge)",
    maintenance: "Wartung",
    suggested: "Vorgeschlagen",
    requiredMessages: "Erforderliche Nachrichten",
    recommendedPlan: "Empfohlener Plan",
    limit: "Limit",
    price: "Preis",
    monthlyBonus: "monatliche Bonus-Nachrichten",
    messages: "Nachrichten",
    deploymentOptions: "Bereitstellungsoptionen",
    storageSize: "Speichergröße",
    bandwidth: "Bandbreite",
    estimatedBandwidth: "Aktuelle Schätzung",
    freePlan: "Kostenloser Plan",
    proPlan: "Pro Plan",
    monthlyPrice: "Monatlicher Preis",
    monthlyBandwidth: "Monatliche Bandbreite",
    builds: "Builds",
    sites: "Websites",
    serverless: "Serverless",
    edgeFunctions: "Edge Functions",
    collaboration: "Zusammenarbeit",
    extras: "Extras",
    vpsMonthlyPrice: "Monatliche VPS-Kosten ($)",
    enterVpsPrice: "Geben Sie die monatlichen VPS-Kosten ein",
    monthlyVpsCost: "Monatliche VPS-Kosten",
  },
  hi: {
    title: "नो-कोड ऐप्स के लिए लागत कैलकुलेटर",
    description: "Lovable.dev, Supabase और Cursor के साथ अपने नो-कोड ऐप के विकास की लागत का अनुमान लगाएं, अपनी आवश्यकताओं के अनुसार मूल्यों को समायोजित करें।",
    lovableSection: "एप्लिकेशन विकास के लिए मुख्य प्लेटफॉर्म",
    supabaseSection: "बैकएंड प्लेटफॉर्म जो डेटाबेस प्रदान करता है",
    cursorSection: "एआई कोड एडिटर",
    results: "परिणाम",
    profitMargin: "लाभ मार्जिन",
    monthlyMaintenance: "मासिक रखरखाव",
    developmentCosts: "विकास लागत (एकमुश्त)",
    monthlyCosts: "मासिक लागत",
    total: "कुल",
    totalWithMargin: "कुल (मार्जिन के साथ)",
    maintenance: "रखरखाव",
    suggested: "सुझाया गया",
    requiredMessages: "आवश्यक संदेश",
    recommendedPlan: "अनुशंसित योजना",
    limit: "सीमा",
    price: "मूल्य",
    monthlyBonus: "मासिक बोनस संदेश",
    messages: "संदेश",
    deploymentOptions: "डिप्लॉयमेंट विकल्प",
    storageSize: "स्टोरेज आकार",
    bandwidth: "बैंडविड्थ",
    estimatedBandwidth: "वर्तमान अनुमान",
    freePlan: "नि:शुल्क योजना",
    proPlan: "प्रो योजना",
    monthlyPrice: "मासिक मूल्य",
    monthlyBandwidth: "मासिक बैंडविड्थ",
    builds: "बिल्ड्स",
    sites: "साइट्स",
    serverless: "सर्वरलेस",
    edgeFunctions: "एज फंक्शंस",
    collaboration: "सहयोग",
    extras: "अतिरिक्त",
    vpsMonthlyPrice: "वीपीएस मासिक लागत ($)",
    enterVpsPrice: "वीपीएस मासिक लागत दर्ज करें",
    monthlyVpsCost: "वीपीएस मासिक लागत",
  },
  zh: {
    title: "无代码应用成本计算器",
    description: "使用Lovable.dev、Supabase和Cursor估算您的无代码应用开发成本，根据您的需求调整值。",
    lovableSection: "应用程序开发的主要平台",
    supabaseSection: "提供数据库的后端平台",
    cursorSection: "AI代码编辑器",
    results: "结果",
    profitMargin: "利润率",
    monthlyMaintenance: "每月维护",
    developmentCosts: "开发成本（一次性）",
    monthlyCosts: "每月成本",
    total: "总计",
    totalWithMargin: "总计（含利润）",
    maintenance: "维护",
    suggested: "建议",
    requiredMessages: "所需消息数",
    recommendedPlan: "推荐方案",
    limit: "限制",
    price: "价格",
    monthlyBonus: "每月奖励消息",
    messages: "消息",
    deploymentOptions: "部署选项",
    storageSize: "存储大小",
    bandwidth: "带宽",
    estimatedBandwidth: "当前估算",
    freePlan: "免费方案",
    proPlan: "专业方案",
    monthlyPrice: "月度价格",
    monthlyBandwidth: "月度带宽",
    builds: "构建次数",
    sites: "站点数",
    serverless: "无服务器",
    edgeFunctions: "边缘函数",
    collaboration: "协作",
    extras: "额外功能",
    vpsMonthlyPrice: "VPS月度成本 ($)",
    enterVpsPrice: "输入VPS月度成本",
    monthlyVpsCost: "VPS月度成本",
  },
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

type DeploymentOption = "netlify" | "vercel" | "vps" | null;

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
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>("en");
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
              {translations[selectedLanguage].price}: Gratuito<br />
              {translations[selectedLanguage].monthlyBandwidth}: 100 GB/mês<br />
              {translations[selectedLanguage].builds}: 300 min/mês<br />
              {translations[selectedLanguage].sites}: Até 500<br />
              {translations[selectedLanguage].serverless}: 125k invocações/mês<br />
              {translations[selectedLanguage].edgeFunctions}: 1M invocações/mês<br />
              {translations[selectedLanguage].collaboration}: 1 membro (Git ilimitado)<br />
              {translations[selectedLanguage].extras}: Pré-visualizações, reversões instantâneas
            </p>
          </div>
        );
      case "vercel":
        return (
          <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-2">
            <h4 className="font-semibold">Vercel Hobby</h4>
            <p className="text-sm text-gray-400">
              {translations[selectedLanguage].price}: Gratuito<br />
              {translations[selectedLanguage].monthlyBandwidth}: 100 GB/mês<br />
              {translations[selectedLanguage].builds}: 6.000 min/mês<br />
              {translations[selectedLanguage].sites}: Até 200<br />
              {translations[selectedLanguage].serverless}: 100k invocações/mês<br />
              {translations[selectedLanguage].edgeFunctions}: 1M invocações/mês<br />
              {translations[selectedLanguage].collaboration}: Sem equipe<br />
              {translations[selectedLanguage].extras}: CI/CD, insights, mitigação DDoS, firewall
            </p>
          </div>
        );
      case "vps":
        return (
          <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-3">
            <h4 className="font-semibold">VPS Customizada</h4>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">{translations[selectedLanguage].vpsMonthlyPrice}</label>
              <Input
                type="number"
                min="0"
                value={vpsPrice}
                onChange={(e) => setVpsPrice(Number(e.target.value))}
                className="w-full"
                placeholder={translations[selectedLanguage].enterVpsPrice}
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
                  {translations[selectedLanguage].requiredMessages}: {lovableTokens.toLocaleString()}
                </label>
                <Slider
                  value={[lovableTokens]}
                  onValueChange={([value]) => setLovableTokens(value)}
                  max={5000}
                  step={50}
                />
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-sm text-gray-300">{translations[selectedLanguage].recommendedPlan}:</p>
                <p className="text-lg font-semibold">{recommendedPlan.name}</p>
                <p className="text-sm text-gray-400">
                  {translations[selectedLanguage].limit}: {recommendedPlan.messages.toLocaleString()} {translations[selectedLanguage].messages}
                  {recommendedPlan.price > 0 && ` + ${MONTHLY_BONUS_MESSAGES} ${translations[selectedLanguage].monthlyBonus}`}
                </p>
                <p className="text-sm text-gray-400">
                  {translations[selectedLanguage].price}: {formatCurrency(recommendedPlan.price)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">{translations[selectedLanguage].deploymentOptions}:</p>
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
                <p className="text-sm text-gray-400">{translations[selectedLanguage].bandwidth}:</p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    {translations[selectedLanguage].freePlan}: 5 GB bandwidth
                  </p>
                  <p className="text-xs text-gray-500">
                    {translations[selectedLanguage].proPlan} ({formatCurrency(25)}): 25 GB bandwidth + {formatCurrency(0.09)} por GB adicional após 8GB
                  </p>
                  <p className="text-sm font-medium">
                    {translations[selectedLanguage].estimatedBandwidth}: {Math.ceil(supabaseRecords / 2700000)} GB
                  </p>
                </div>
