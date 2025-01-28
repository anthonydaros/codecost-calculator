import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    flex: 1,
    fontSize: 12,
  },
  value: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
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
          <Text style={styles.title}>Cost Report</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Lovable.dev Configuration</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Messages Required</Text>
            <Text style={styles.value}>{lovableTokens.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Recommended Plan</Text>
            <Text style={styles.value}>{recommendedPlan.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Plan Cost</Text>
            <Text style={styles.value}>{formatCurrency(recommendedPlan.price)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.subtitle}>Supabase Configuration</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Monthly Active Users</Text>
            <Text style={styles.value}>{supabaseUsers.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Database Records</Text>
            <Text style={styles.value}>{supabaseRecords.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Storage Size</Text>
            <Text style={styles.value}>{formatStorageSize(supabaseRecords)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>File Storage</Text>
            <Text style={styles.value}>{supabaseStorage} GB</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.subtitle}>Cursor Configuration</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Selected Plan</Text>
            <Text style={styles.value}>{cursorPlan}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.subtitle}>Cost Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Profit Margin</Text>
            <Text style={styles.value}>{profitMargin}%</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Maintenance Percentage</Text>
            <Text style={styles.value}>{maintenancePercentage}%</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Development Total (with margin)</Text>
            <Text style={styles.value}>{formatCurrency(developmentTotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Monthly Total (with margin)</Text>
            <Text style={styles.value}>{formatCurrency(monthlyTotal)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};