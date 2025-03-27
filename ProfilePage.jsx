import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  // 定义表单状态
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // 提交表单时的处理函数
  const handleSubmit = () => {
    if (!name || !email || !phone) {
      Alert.alert('错误', '请填写所有必填项');
      return;
    }

    // 这里可以添加将数据发送到服务器的逻辑
    Alert.alert('成功', '个人信息已更新');
    console.log('提交的个人信息:', { name, email, phone });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>个人信息</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>姓名</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入姓名"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>邮箱</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>电话</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入电话"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <Button title="保存" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
  },
});

export default ProfileScreen;