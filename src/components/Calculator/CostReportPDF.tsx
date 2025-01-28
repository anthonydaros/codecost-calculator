import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 12,
    color: '#4B5563',
    borderBottomWidth: 2,
    borderColor: '#8B5CF6',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
  },
  value: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right',
    color: '#374151',
    fontWeight: 'bold',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
});

interface CostReportPDFProps {
  lovableTokens: number;
  recommendedPlan: {
    name: string;
    messages: number;
    price: number;
  };
  supabaseUsers: number;
  supabaseRecords: number;
  supabaseStorage: number;
  cursorPlan: string;
  profitMargin: number;
  maintenancePercentage: number;
  developmentTotal: number;
  monthlyTotal: number;
  showInBRL: boolean;
  exchangeRate: number;
}

export const CostReportPDF = ({
  lovableTokens,
  recommendedPlan,
  supabaseUsers,
  supabaseRecords,
  supabaseStorage,
  cursorPlan,
  profitMargin,
  maintenancePercentage,
  developmentTotal,
  monthlyTotal,
  showInBRL,
  exchangeRate,
}: CostReportPDFProps) => {
  const formatCurrency = (value: number) => {
    if (showInBRL) {
      return `R$ ${(value * exchangeRate).toFixed(2)}`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatStorageSize = (records: number): string => {
    const sizeInGB = records / 2700000;
    if (sizeInGB < 1) {
      return `${(sizeInGB * 1024).toFixed(2)} MB`;
    }
    return `${sizeInGB.toFixed(2)} GB`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Relatório de Custos</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Configuração Lovable.dev</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Mensagens Necessárias</Text>
            <Text style={styles.value}>{lovableTokens.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Plano Recomendado</Text>
            <Text style={styles.value}>{recommendedPlan.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Custo do Plano</Text>
            <Text style={styles.value}>{formatCurrency(recommendedPlan.price)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Configuração Supabase</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Usuários Ativos Mensais</Text>
            <Text style={styles.value}>{supabaseUsers.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Registros no Banco</Text>
            <Text style={styles.value}>{supabaseRecords.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tamanho do Banco</Text>
            <Text style={styles.value}>{formatStorageSize(supabaseRecords)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Armazenamento</Text>
            <Text style={styles.value}>{supabaseStorage} GB</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Configuração Cursor</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Plano Selecionado</Text>
            <Text style={styles.value}>{cursorPlan}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Resumo de Custos</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Margem de Lucro</Text>
            <Text style={styles.value}>{profitMargin}%</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Percentual de Manutenção</Text>
            <Text style={styles.value}>{maintenancePercentage}%</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Desenvolvimento (com margem)</Text>
            <Text style={styles.value}>{formatCurrency(developmentTotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Mensal (com margem)</Text>
            <Text style={styles.value}>{formatCurrency(monthlyTotal)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>Desenvolvido por Anthony Max</Text>
      </Page>
    </Document>
  );
};