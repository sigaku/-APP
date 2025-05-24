import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    FlatList, 
    Image, 
    RefreshControl, 
    ActivityIndicator, 
    Alert 
} from 'react-native';
import TimeDisplay from './TimeDisplay';
import Popupcomponent from './Popupcomponent';
import { useNavigation } from '@react-navigation/native';
import foodIcon from '../app.UI/food.png'; // 请确保图标路径正确
import shoppingIcon from '../app.UI/shopping.png';
import transportIcon from '../app.UI/transport.png';
import entertainmentIcon from '../app.UI/entertainment.png';
import lifeIcon from '../app.UI/life.png';
import transferIcon from '../app.UI/transfer2.png';

const categoryIcons = {
  food: foodIcon,
  shopping: shoppingIcon,
  transport: transportIcon,
  entertainment: entertainmentIcon,
  life: lifeIcon,
  transfer: transferIcon,
};

// 函数：格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 函数：根据交易类型返回符号
const getAmountPrefix = (type) => {
  return type === 2 ? '-' : '+';
};

// 函数：根据类别返回图标
const getCategoryIcon = (category) => {
  return categoryIcons[category] || defaultIcon;
};

// 默认图标（可选）
const defaultIcon = foodIcon; // 或者您可以定义一个默认图标

const AccountingPage = () => {
  const navigation = useNavigation();
  const [isPopupVisible, setPopupVisible] = useState(false);
  
  // 状态用于存储财务汇总数据
  const [summaryData, setSummaryData] = useState({
    monthly_income: 0,
    monthly_expense: 0,
    today_expense: 0,
  });
  
  // 状态用于存储交易记录
  const [transactions, setTransactions] = useState([]); 
  const [loading, setLoading] = useState(false); // 用于显示加载状态
  const [error, setError] = useState(null); // 用于存储错误信息
  const flatListRef = useRef(null); // 用于引用 FlatList

  // 定义两个 API 的端点
  const summaryApiUrl = ' https://0e74-223-104-194-124.ngrok-free.app/api/stats/index/'; // 替换为实际的财务汇总 API 端点
  const transactionsApiUrl = ' https://0e74-223-104-194-124.ngrok-free.app/api/transaction/get/'; // 替换为实际的交易记录 API 端点

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (loading) return; // 防止重复请求
    setLoading(true);
    setError(null);
    try {
      // 并行获取两个 API 的数据
      const [summaryResponse, transactionsResponse] = await Promise.all([
        fetch(summaryApiUrl),
        fetch(transactionsApiUrl),
      ]);

      // 检查财务汇总 API 的响应状态
      if (!summaryResponse.ok) {
        throw new Error(`财务汇总 API HTTP error! status: ${summaryResponse.status}`);
      }

      // 检查交易记录 API 的响应状态
      if (!transactionsResponse.ok) {
        throw new Error(`交易记录 API HTTP error! status: ${transactionsResponse.status}`);
      }

      // 解析财务汇总数据
      const summaryData = await summaryResponse.json();

      // 解析交易记录数据
      const transactionsData = await transactionsResponse.json();

      // 按照日期分组
      const groupedTransactions = groupByDate(transactionsData);

      // 更新状态
      setSummaryData({
        monthly_income: summaryData.monthly_income,
        monthly_expense: summaryData.monthly_expense,
        today_expense: summaryData.today_expense,
      });

      setTransactions(groupedTransactions);
    } catch (err) {
      console.error(err);
      setError(err.message);
      Alert.alert('错误', '无法获取数据，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  // 函数：按日期分组交易记录
  const groupByDate = (transactions) => {
    const grouped = {};
    transactions.forEach((transaction) => {
      const date = formatDate(transaction.date);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    // 将对象转换为数组，并按日期排序
    const groupedArray = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).map((date) => ({
      date: date,
      transactions: grouped[date],
    }));
    return groupedArray;
  };

  const onRefresh = () => {
    fetchData();
  };

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  // 函数：获取当前日期
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.container}>
      <TimeDisplay navigation={navigation} />
      {/* Content Area */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={['#1890ff']} // 刷新指示器的颜色
            tintColor="#1890ff" // iOS 下的刷新指示器颜色
          />
        }
      >
        {/* Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>今日支出</Text>
          <Text style={styles.amount}>¥{summaryData.today_expense.toFixed(2)}</Text>

          <Text style={styles.sectionTitle}>本月支出</Text>
          <Text style={styles.amount}>¥{summaryData.monthly_expense.toFixed(2)}</Text>

          <Text style={styles.sectionTitle}>本月收入</Text>
          <Text style={[styles.amount, styles.incomeAmount]}>¥{summaryData.monthly_income.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        {/* Daily Records */}
        <View style={styles.dailyRecord}>
          {loading ? (
            <Text style={styles.transactionText}>加载中...</Text>
          ) : error ? (
            <Text style={styles.transactionText}>错误: {error}</Text>
          ) : transactions.length === 0 ? (
            <Text style={styles.transactionText}>暂无交易记录</Text>
          ) : (
            <FlatList
              ref={flatListRef}
              data={transactions}
              keyExtractor={(item) => item.date}
              renderItem={({ item }) => (
                <View>
                  {/* 日期标题 */}
                  <Text style={styles.dateTitle}>{item.date}</Text>
                  {/* 交易记录 */}
                  {item.transactions.map((transaction) => (
                    <View key={transaction.id} style={styles.transactionItem}>
                      <Image
                        source={getCategoryIcon(transaction.category)}
                        style={styles.transactionIcon}
                      />
                      <View style={styles.transactionDetails}>
                        <Text style={styles.category}>{transaction.category}</Text>
                        <Text style={styles.time}>{transaction.date}</Text>
                        <Text style={styles.autoRecord}>
                          {transaction.transaction_type === 2 ? '支出' : '收入'}
                        </Text>
                      </View>
                      <Text style={styles.amount}>
                        {getAmountPrefix(transaction.transaction_type)}
                        {transaction.amount}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            />
          )}
        </View>

        {/* 可以根据需要添加更多的每日记录 */}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Accounting')}>
          <Text style={styles.tabText}>记账</Text>
          <Image
            style={styles.circleImage}
            source={require('../app.UI/note.png')} // 请确保您有一个头像图片
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Finance')}>
          <Text style={styles.tabText}>报表</Text>
          <Image
            style={styles.circleImage}
            source={require('../app.UI/baobiao.png')} // 请确保您有一个头像图片
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={togglePopup}>
          <View style={styles.bottomionicon}>
          
              <Text style={styles.tabText}>   记一笔</Text>
              <Image
                style={styles.circleImage}
                source={require('../app.UI/plus.png')} // 请确保您有一个头像图片
                resizeMode="cover"
              />
              
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>设置</Text>
          <Image
            style={styles.circleImage}
            source={require('../app.UI/setting.png')} // 请确保您有一个头像图片
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.tabText}>我的</Text>
          <Image
            style={styles.circleImage}
            source={require('../app.UI/account.png')} // 请确保您有一个头像图片
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* Popup Component */}
      <Popupcomponent visible={isPopupVisible} onClose={togglePopup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  summarySection: {
    backgroundColor: '#FFE4E1',
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#ff4d4f',
  },
  incomeAmount: {
    color: '#52c41a',
  },
  divider: {
    height: 10,
    backgroundColor: '#f5f5f5',
  },
  dailyRecord: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  transactionText: {
    fontSize: 14,
    color: '#666',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  autoRecord: {
    fontSize: 12,
    color: '#1890ff',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    paddingBottom: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  bottomionicon: {
    alignItems: 'center',
  },
  bottomplus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1890ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  plus: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  plusfont: {
    // Style for the text below plus button
  },
  circleImage: {
    width: 54,
    height: 54,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4d',
    textAlign: 'center',
  },
});

export default AccountingPage;
