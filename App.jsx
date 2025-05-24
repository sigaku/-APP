import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import Mainpage from './jizhangAPP/Mainpage';
import Denglupage from './jizhangAPP/Denglupage';
import Zhucepage from './jizhangAPP/Zhucepage';
import ProfilePage from './jizhangAPP/Profilepage';
import Accountingpage from'./jizhangAPP/Accountingpage';
import FinanceScreen from './jizhangAPP/FinanceScreen';


const Stack = createNativeStackNavigator();


export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Mainpage} />
          <Stack.Screen name="Login" component={Denglupage}/>
          <Stack.Screen name="Register" component={Zhucepage}/>
          <Stack.Screen name="Profile" component={ProfilePage}/>
          <Stack.Screen name="Accounting" component={Accountingpage}/>
          <Stack.Screen name="Finance" component={FinanceScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
