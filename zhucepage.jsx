import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, ActivityIndicator } from 'react-native';

// 替换为您的 API 基础 URL
const API_BASE_URL = ' https://0e74-223-104-194-124.ngrok-free.app/api/users/register/';

function RegisterScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    // 基本表单验证
    if (!phone || !email || !password) {
      setError('请填写所有必填字段。');
      return;
    }

    // 电话号格式验证（简单示例：仅数字，长度10-15位）
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setError('请输入有效的电话号。');
      return;
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址。');
      return;
    }

    // 密码强度验证（示例：至少6个字符）
    if (password.length < 6) {
      setError('密码至少需要6个字符。');
      return;
    }

    setError('');
    setIsLoading(true);

    // 实际的注册请求
    fetch(API_BASE_URL, { // 使用配置好的 API_BASE_URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, email, password }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.message || '注册失败');
          });
        }
      })
      .then((data) => {
        Alert.alert('成功', '注册成功，请登录。', [
          { text: '确定', onPress: () => navigation.navigate('Login') },
        ]);
      })
      .catch((err) => {
        setError(err.message);
        console.error('注册错误:', err); // 记录错误日志
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ImageBackground
      source={require('../Images/124.jpeg')} // 确保图片路径正确
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>注册</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="电话号"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="注册" onPress={handleRegister} />
        )}
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

export default RegisterScreen;
