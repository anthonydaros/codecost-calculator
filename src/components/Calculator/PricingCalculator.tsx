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
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CostReportPDF } from './CostReportPDF';
import { Download } from "lucide-react";

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
  { name: "Scale 7", messages: 5000, price: 900 }
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
  const [showInBRL, setShowInBRL] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(5);

  const formatCurrency = (value: number): string => {
    if (showInBRL) {
      return `R$ ${(value * exchangeRate).toFixed(2)}`;
    }
    return `$${value.toFixed(2)}`;
  };

  const toggleCurrency = () => {
    setShowInBRL(!showInBRL);
  };

  const calculateLovableCost = () => {
    return recommendedPlan.price;
  };

  const calculateSupabaseCost = () => {
    const FREE_USERS = 50000;
    const FREE_STORAGE = 1;
    const FREE_DATABASE = 0.5;

    const PRO_USERS = 100000;
    const PRO_STORAGE = 100;
    const PRO_DATABASE = 8;

    const EXTRA_USER_COST = 0.00325;
    const EXTRA_STORAGE_COST = 0.021;
    const EXTRA_DATABASE_COST = 0.125;

    let totalCost = 0;

    // Users calculation
    if (supabaseUsers > FREE_USERS) {
      if (supabaseUsers > PRO_USERS) {
        const extraUsers = supabaseUsers - PRO_USERS;
        totalCost += 25 + (extraUsers * EXTRA_USER_COST);
      } else {
        totalCost += 25;
      }
    }

    // Storage calculation
    if (supabaseStorage > FREE_STORAGE) {
      if (supabaseStorage > PRO_STORAGE) {
        const extraStorage = supabaseStorage - PRO_STORAGE;
        totalCost += extraStorage * EXTRA_STORAGE_COST;
      }
      totalCost += 25;
    }

    // Database records calculation (convert to GB)
    const recordsInGB = supabaseRecords / 2700000;
    if (recordsInGB > FREE_DATABASE) {
      if (recordsInGB > PRO_DATABASE) {
        const extraDB = recordsInGB - PRO_DATABASE;
        totalCost += extraDB * EXTRA_DATABASE_COST;
      }
      totalCost += 25;
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
    const monthlyCosts = calculateMonthlyCosts();
    return monthlyCosts * (1 + profitMargin / 100);
  };

  const renderPDFDownload = () => (
    <PDFDownloadLink
      document={
        <CostReportPDF
          lovableTokens={lovableTokens}
          recommendedPlan={recommendedPlan}
          supabaseUsers={supabaseUsers}
          supabaseRecords={supabaseRecords}
          supabaseStorage={supabaseStorage}
          cursorPlan={cursorPlan}
          profitMargin={profitMargin}
          maintenancePercentage={maintenancePercentage}
          developmentTotal={calculateDevelopmentTotalWithMargin()}
          monthlyTotal={calculateMonthlyTotalWithMargin()}
          showInBRL={showInBRL}
          exchangeRate={exchangeRate}
        />
      }
      fileName="cost-report.pdf"
    >
      {({ loading }) => (
        <Button disabled={loading}>
          <Download className="w-4 h-4 mr-2" />
          {loading ? "Gerando PDF..." : "Exportar PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <CalculatorSection>
        <h1 className="text-2xl font-bold">Calculadora de Preços</h1>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="text-sm text-gray-400">Tokens Lovable</label>
            <Input
              type="number"
              value={lovableTokens}
              onChange={(e) => setLovableTokens(Number(e.target.value))}
              className="w-full"
              placeholder="Digite o número de tokens"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Margem de Lucro (%)</label>
            <Input
              type="number"
              value={profitMargin}
              onChange={(e) => setProfitMargin(Number(e.target.value))}
              className="w-full"
              placeholder="Digite a margem de lucro"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Porcentagem de Manutenção (%)</label>
            <Input
              type="number"
              value={maintenancePercentage}
              onChange={(e) => setMaintenancePercentage(Number(e.target.value))}
              className="w-full"
              placeholder="Digite a porcentagem de manutenção"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Usuários Supabase</label>
            <Input
              type="number"
              value={supabaseUsers}
              onChange={(e) => setSupabaseUsers(Number(e.target.value))}
              className="w-full"
              placeholder="Digite o número de usuários"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Registros Supabase</label>
            <Input
              type="number"
              value={supabaseRecords}
              onChange={(e) => setSupabaseRecords(Number(e.target.value))}
              className="w-full"
              placeholder="Digite o número de registros"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Armazenamento Supabase (GB)</label>
            <Input
              type="number"
              value={supabaseStorage}
              onChange={(e) => setSupabaseStorage(Number(e.target.value))}
              className="w-full"
              placeholder="Digite o armazenamento em GB"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Plano do Cursor</label>
            <Select onValueChange={setCursorPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hobby">Hobby</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-400">Opção de Implantação</label>
            <Select onValueChange={setSelectedDeployment}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="netlify">Netlify</SelectItem>
                <SelectItem value="vercel">Vercel</SelectItem>
                <SelectItem value="vps">VPS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button onClick={toggleCurrency}>
              {showInBRL ? "Mostrar em USD" : "Mostrar em BRL"}
            </Button>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Custo Total: {formatCurrency(totalCost())}</h2>
          </div>
          {getDeploymentContent()}
          {renderPDFDownload()}
        </div>
      </CalculatorSection>
    </div>
  );
};
