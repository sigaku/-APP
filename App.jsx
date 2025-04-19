import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import PopupComponent from './madal.jsx';

const { width, height } = Dimensions.get('window');

const AccountingApp = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerText}>记账</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content}>
        {/* Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>今日支出</Text>
          <Text style={styles.amount}>¥0.00</Text>

          <Text style={styles.sectionTitle}>本月支出</Text>
          <Text style={styles.amount}>¥0.00</Text>

          <Text style={styles.sectionTitle}>本月收入</Text>
          <Text style={[styles.amount, styles.incomeAmount]}>¥0.00</Text>
        </View>

        <View style={styles.divider} />

        {/* Daily Records */}
        <View style={styles.dailyRecord}>
          <Text style={styles.date}>今天</Text>
          <View style={styles.dailySummary}>
            <Text style={styles.transactionText}>暂无交易记录</Text>
          </View>

          <View style={styles.transactionItem}>
            <Text style={styles.category}>餐饮</Text>
            <Text style={styles.time}>12:30</Text>
            <Text style={styles.autoRecord}>自动记录</Text>
            <Text style={styles.amount}>-¥45.00</Text>
          </View>
        </View>

        <View style={styles.divider} />
        
        <View style={styles.dailyRecord}>
          <Text style={styles.date}>昨天</Text>
          <View style={styles.dailySummary}>
            <Text style={styles.transactionText}>暂无交易记录</Text>
          </View>
          <View style={styles.transactionItem}>
            <Text style={styles.category}>餐饮</Text>
            <Text style={styles.time}>12:30</Text>
            <Text style={styles.autoRecord}>自动记录</Text>
            <Text style={styles.amount}>-¥45.00</Text>
          </View>
        </View>

        <View style={styles.divider} />
        
        <View style={styles.dailyRecord}>
          <Text style={styles.date}>前天</Text>
          <View style={styles.dailySummary}>
            <Text style={styles.transactionText}>暂无交易记录</Text>
          </View>
          <View style={styles.transactionItem}>
            <Text style={styles.category}>餐饮</Text>
            <Text style={styles.time}>12:30</Text>
            <Text style={styles.autoRecord}>自动记录</Text>
            <Text style={styles.amount}>-¥45.00</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>记账</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>报表</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={togglePopup}>
          <View style={styles.bottomionicon}>
            <View style={styles.bottomplus}>
              <Text style={styles.plus}>+</Text>
            </View>
            <View style={styles.plusfont}>
              <Text style={styles.tabText}>记一笔</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>设置</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>我的</Text>
        </TouchableOpacity>
      </View>
      
      {/* Popup Component */}
      <PopupComponent 
        visible={isPopupVisible} 
        onClose={togglePopup} 
      />
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
  dailySummary: {
    marginBottom: 15,
  },
  transactionText: {
    fontSize: 14,
    color: '#666',
  },
  transactionItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#999',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  modalTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  modalall:{
   flexDirection:'column', 
  },
  modal:{
    width:width*0.9,
    height:height*0.1,
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    flex:2,
  },
});

export default AccountingApp;
