import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground } from 'react-native';

// 假设您有一个配置文件来管理环境变量
const API_BASE_URL = ' https://0e74-223-104-194-124.ngrok-free.app/api/users/login/'; // 替换为您的 API 基础 URL

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // 基本表单验证
    if (!email || !password) {
      setError('请填写邮箱和密码。');
      return;
    }

    // 发送登录请求
    fetch(`${API_BASE_URL}`, { // 使用配置好的 API_BASE_URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }), // 使用 email 字段
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.message || '登录失败');
          });
        }
      })
      .then((data) => {
        // 处理登录成功逻辑
        Alert.alert('成功', '登录成功。', [
          { text: '确定', onPress: () => navigation.navigate('Accounting') },
        ]);
        // 您可以在这里处理返回的数据，例如存储令牌
      })
      .catch((err) => {
        // 处理错误并显示给用户
        setError(err.message);
        console.error('登录错误:', err); // 记录错误日志
      });
  };

  return (
    <ImageBackground
      source={require('../Images/124.jpeg')} // 确保图片路径正确
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>登录</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="请输入邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="请输入密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="登录" onPress={handleLogin} />
        <Button title="返回" onPress={() => navigation.goBack()} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { // 移除背景颜色以显示背景图片
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: '#fff', // 移除背景颜色
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // 根据背景图片调整文字颜色
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff', // 使输入框背景为白色
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default LoginScreen;
