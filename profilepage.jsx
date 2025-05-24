import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

const API_URL = 'https://0e74-223-104-194-124.ngrok-free.app/api/users/profile/'; // 替换为你的 API 端点

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 如果需要认证，可以在这里添加，例如：
            // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>加载中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>错误: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>用户信息</Text>
      <View style={styles.field}>
        <Text style={styles.label}>用户名 (username):</Text>
        <Text style={styles.value}>{userData.username}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>姓名 (name):</Text>
        <Text style={styles.value}>{userData.name}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>生日 (birthday):</Text>
        <Text style={styles.value}>{userData.birthday}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>组ID (groupid):</Text>
        <Text style={styles.value}>{userData.groupid}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>电话 (phone):</Text>
        <Text style={styles.value}>{userData.phone}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>电子邮件 (email):</Text>
        <Text style={styles.value}>{userData.email}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    color: '#555',
  },
  value: {
    fontSize: 18,
    color: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default UserProfile;
