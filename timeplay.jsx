// components/TimeDisplay.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image} from 'react-native';

const TimeDisplay = ({ navigation }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date());
    }, 1000); // 每秒更新一次

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const monthMap = {
    0: '一月',
    1: '二月',
    2: '三月',
    3: '四月',
    4: '五月',
    5: '六月',
    6: '七月',
    7: '八月',
    8: '九月',
    9: '十月',
    10: '十一月',
    11: '十二月',
  };

  const now = time;
  const month = now.getMonth();
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
          navigation.navigate('Profile');
        }}
      >
        <Image
          style={styles.circleImage}
          source={require('../Images/122.jpg')} // 请确保您有一个头像图片
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default TimeDisplay;
