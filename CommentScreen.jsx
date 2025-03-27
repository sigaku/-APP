// CommentScreen.js
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';

const CommentScreen = ({ route }) => {
  const [data, setData] = useState(null);      // 存储获取到的数据
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null);     // 错误信息

  useEffect(() => {
    const fetchData = async () => {
      const { id } = route.params; // 从导航参数中获取id
      const url = `https://news-at.zhihu.com/api/3/story-extra/${id}`; // 构建请求URL

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [route.params]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>加载中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>评论</Text>
      {data.comments && data.comments.length > 0 ? (
        data.comments.map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
            <Text style={styles.commentText}>{comment}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>暂无评论</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commentContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2, // Android 阴影
    shadowColor: '#000', // iOS 阴影
    shadowOffset: { width: 0, height: 1 }, // iOS 阴影
    shadowOpacity: 0.3, // iOS 阴影
    shadowRadius: 1, // iOS 阴影
  },
  commentText: {
    fontSize: 16,
    color: '#000000',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default CommentScreen;