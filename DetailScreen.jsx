// DetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button } from 'react-native';
import { WebView } from 'react-native-webview';

const DetailScreen = ({ route, navigation }) => {
  const { item } = route.params;

  // TextContent 组件，用于从 uri 中读取文本内容
  const TextContent = ({ uri }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchText = async () => {
        setLoading(true);
        try {
          const response = await fetch(uri);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const text = await response.text();
          setContent(text);
        } catch (err) {
          setError(err.message);
          console.error('Failed to fetch text content:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchText();
    }, [uri]);

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>{content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: item.url }}
        style={styles.webview}
        startInLoadingState={true}
        renderError={(errorName) => (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>WebView Error: {errorName}</Text>
          </View>
        )}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <Text>Loading WebView...</Text>
          </View>
        )}
      />
      <View style={styles.commentsview}>
        <Button
          title="查看评论"
          onPress={() => navigation.navigate('Comment', { id: item.id })} // 传递 id 参数
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  webview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 8,
  },
  commentsview: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
  },
  contentText: {
    fontSize: 16,
    color: '#000000',
  },
});

export default DetailScreen;