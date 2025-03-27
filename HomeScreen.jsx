import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

// 日期显示组件
const DateDisplay = ({ date, style }) => {
  const formattedDate = moment(date).format('YYYY年MM月DD日');
  return (
    <View style={[styles.dateContainer, style]}>
      <Text style={styles.dateText}>{formattedDate}—————————————————————————</Text>
    </View>
  );
};



const TimeDisplay = () => {
  const navigation = useNavigation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date());
    }, 1000); // 每秒更新一次

    return () => {
      clearInterval(timerID);
    };
  }, []);

  useEffect(() => {
    // 打印 navigation 的值
    console.log(navigation);
  }, [navigation]); // 依赖于 navigation，确保每次 navigation 变化时都会打印

  const monthMap = {
    1: '一月',
    2: '二月',
    3: '三月',
    4: '四月',
    5: '五月',
    6: '六月',
    7: '七月',
    8: '八月',
    9: '九月',
    10: '十月',
    11: '十一月',
    12: '十二月',
  };

  const now = time;
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hours = now.getHours();
  let message = '';

  if (hours < 12) {
    message = '上午好！';
  } else if (hours < 18) {
    message = '下午好！';
  } else if (hours >= 18 && hours < 23) {
    message = '晚上好！';
  } else {
    message = '早点休息~';
  }

  return (
    <View style={styles.timeContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.text}>{`${day}`}</Text>
        <Text style={styles.text1}>{`${monthMap[month]}`}</Text>
      </View>

      <View style={styles.separator}></View>

      <View style={styles.greetingContainer}>
        <Text style={styles.text2}>{message}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (navigation) {
            navigation.navigate('Profile');
          } else {
            Alert.alert('错误', '导航功能不可用');
          }
        }}
      >
        <Image
          style={styles.circleImage}
          source={require('../Images/122.jpg')}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

// 主组件
const HomeScreen = ({ navigation }) => {
  const [newsList, setNewsList] = useState([]);
  const [page, setPage] = useState(1); // 当前页数
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null);



  const fetchNewsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const today = moment().format('YYYYMMDD');
      const yesterday = moment().subtract(1, 'days').format('YYYYMMDD');
      const yesYesterday = moment().subtract(2, 'days').format('YYYYMMDD');

      // 获取今天的新闻
      const todayResponse = await fetch(`http://news-at.zhihu.com/api/3/stories/latest`);
      if (!todayResponse.ok) {
        throw new Error(`HTTP error! status: ${todayResponse.status}`);
      }
      const todayData = await todayResponse.json();
      setNewsList(todayData.stories);

      // 获取昨天的新闻
      const yesterdayResponse = await fetch(`https://news-at.zhihu.com/api/3/news/before/${yesterday}`);
      if (!yesterdayResponse.ok) {
        throw new Error(`HTTP error! status: ${yesterdayResponse.status}`);
      }
      const yesterdayData = await yesterdayResponse.json();
      setNewsList(prevNews => [...prevNews, ...yesterdayData.stories]);

      // 获取前天的新闻
      const yesYesterdayResponse = await fetch(`https://news-at.zhihu.com/api/3/news/before/${yesYesterday}`);
      if (!yesYesterdayResponse.ok) {
        throw new Error(`HTTP error! status: ${yesYesterdayResponse.status}`);
      }
      const yesYesterdayData = await yesYesterdayResponse.json();
      setNewsList(prevNews => [...prevNews, ...yesYesterdayData.stories]);
    } catch (err) {
      setError(err.message);
      Alert.alert('错误', '获取新闻数据失败');
      console.error('获取新闻数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  const loadMoreNews = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const date = moment().subtract(page + 2, 'days').format('YYYYMMDD');
      const response = await fetch(`https://news-at.zhihu.com/api/3/news/before/${date}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNewsList(prevNews => [...prevNews, ...data.stories]);
      setPage(prevPage => prevPage + 1);
    } catch (err) {
      setError(err.message);
      Alert.alert('错误', '加载更多新闻失败');
      console.error('加载更多新闻失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, page]);

  const handleLoadMore = useCallback(() => {
    loadMoreNews();
  }, [loadMoreNews]);

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TimeDisplay />
      <DateDisplay/>
      <FlatList
        ref={flatListRef}
        data={newsList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.newsview}
            onPress={() => navigation.navigate('Detail', { item })}
          >
            <View style={styles.newstext}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.hint}>{item.hint}</Text>
            </View>
            <View style={styles.newsimageview}>
              {item.images && item.images.length > 0 ? (
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.newsImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.error('Failed to load image:', error);
                  }}
                />
              ) : (
                <Image
                  source={require('../Images/123.jpg')}
                  style={styles.newsImage}
                  resizeMode="cover"
                />
              )}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
      {error && <Text style={styles.errorText}>错误: {error}</Text>}
    </View>
  );
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      paddingTop: 10,
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 5,
      elevation: 2,
      marginBottom: 10,
    },
    dateContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    text: {
      fontSize: 30,
      color: '#000000',
    },
    text1: {
      fontSize: 20,
      color: '#000000',
    },
    text2: {
      fontSize: 40,
      color: '#000000',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    circleImage: {
      width: 54,
      height: 54,
      borderRadius: 27,
    },
    newsListContainer: {
      flex: 1,
      width: '100%',
      padding: 10,
    },
    listContainer: {
      flex: 1,
    },
    loadingText: {
      textAlign: 'center',
      marginTop: 10,
      fontSize: 16,
      color: '#555',
    },
    errorText: {
      textAlign: 'center',
      marginTop: 10,
      fontSize: 16,
      color: 'red',
    },
    newsview: {
      flexDirection: 'row',
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
      width: '100%',
      alignItems: 'flex-start',
      backgroundColor: '#FFFFFF',
      elevation: 2,
    },
    newstext: {
      flex: 1,
      paddingRight: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    hint: {
      fontSize: 14,
      color: '#666',
    },
    newsimageview: {
      width: 120,
      height: 80,
      borderRadius: 5,
      overflow: 'hidden',
    },
    separator: {
      width: 2, 
      height: '100%',
      backgroundColor: '#808080', 
    },
    newsImage: {
      width: '100%',
      height: '100%',
    },
  });
export default HomeScreen;


