import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const API_URL = ' https://0e74-223-104-194-124.ngrok-free.app/api/stats/'; // 替换为你的API端点

const FinanceOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  // 提取所需的数据
  const {
    monthly_income,
    monthly_expense,
    today_income,
    today_expense,
    daily_income_avg,
    daily_expense_avg,
    monthly_balance,
    expense_ratio,
  } = data;

  // 准备饼状图的数据
  const chartData = [
    {
      name: 'Food',
      population: expense_ratio.expense_ratio_food,
      color: '#F00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Transport',
      population: expense_ratio.expense_ratio_transport,
      color: '#0F0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Life',
      population: expense_ratio.expense_ratio_life,
      color: '#00F',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Shopping',
      population: expense_ratio.expense_ratio_shopping,
      color: '#FF0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Entertainment',
      population: expense_ratio.expense_ratio_entertainment,
      color: '#0FF',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  // 竖直排列的支出比例数据
  const verticalExpenseData = [
    { name: 'Food', ratio: expense_ratio.expense_ratio_food },
    { name: 'Transport', ratio: expense_ratio.expense_ratio_transport },
    { name: 'Life', ratio: expense_ratio.expense_ratio_life },
    { name: 'Shopping', ratio: expense_ratio.expense_ratio_shopping },
    { name: 'Entertainment', ratio: expense_ratio.expense_ratio_entertainment },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Monthly Overview</Text>
        <View style={styles.row}>
          <View style={styles.item}>
            <Text style={styles.label}>Income</Text>
            <Text style={styles.value}>+{monthly_income}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Expense</Text>
            <Text style={styles.value}>-{monthly_expense}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.item}>
            <Text style={styles.label}>Balance</Text>
            <Text style={styles.value}>{monthly_balance}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Today Overview</Text>
        <View style={styles.row}>
          <View style={styles.item}>
            <Text style={styles.label}>Income</Text>
            <Text style={styles.value}>+{today_income}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Expense</Text>
            <Text style={styles.value}>-{today_expense}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.item}>
            <Text style={styles.label}>Daily Income Avg</Text>
            <Text style={styles.value}>+{daily_income_avg}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Daily Expense Avg</Text>
            <Text style={styles.value}>-{daily_expense_avg}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Expense Ratio</Text>
        <PieChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
        <View style={styles.legend}>
          <FlatList
            data={verticalExpenseData}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View style={styles.legendItem}>
                <View style={{ backgroundColor: chartData.find((c) => c.name === item.name)?.color, width: 12, height: 12, marginRight: 8 }} />
                <Text>{item.name}</Text>
                <Text>  {`${(item.ratio * 100).toFixed(2)}%`}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  item: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  legend: {
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default FinanceOverview;
