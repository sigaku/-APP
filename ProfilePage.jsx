// MainPage.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Button, } from 'react-native-elements';

const MainPage = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../Images/124.jpeg')} // 请确保在项目中有一个合适的背景图片
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>记账不仅是一种行为，更是一种对生活的态度</Text>
        <View style={styles.buttonGroup}>
          <Button
            title="登录"
            buttonStyle={styles.loginButton}
            titleStyle={styles.buttonTitle}
            onPress={() => navigation.navigate('Login')}
            
            
          />
          <Button
            title="注册"
            buttonStyle={styles.registerButton}
            titleStyle={styles.buttonTitle}
            onPress={() => navigation.navigate('Register')}
           
            
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 50,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  buttonGroup: {
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  registerButton: {
    backgroundColor: '#008CBA',
    borderRadius: 30,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    marginRight: 10,
  },
});

export default MainPage;
