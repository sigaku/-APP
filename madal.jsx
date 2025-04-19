import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';

const Categories = [
  { id: 1, name: '生活日用' },
  { id: 2, name: '转账' },
  { id: 3, name: '消费' },
  { id: 4, name: '餐饮' },
  { id: 5, name: '娱乐' },
];

const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '完成', '0', '删除'];

const PopupComponent = ({ visible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [numberKeyboardVisible, setNumberKeyboardVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [amount, setAmount] = useState('');

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 格式化时间为 "YYYY-MM-DD HH:mm" 格式
  const formatTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const showNumberKeyboard = () => {
    setNumberKeyboardVisible(true);
  };

  const closeNumberKeyboard = () => {
    setNumberKeyboardVisible(false);
  };

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    setModalVisible(false);
    onClose && onClose();
  };

  const handleNumberPress = (number) => {
    if (number === '删除') {
      setAmount((prevAmount) => prevAmount.slice(0, -1));
    } else if (number === '完成') {
      closeNumberKeyboard();
    } else {
      setAmount((prevAmount) => prevAmount + number);
    }
  };

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <View style={styles.header}>
        <View style={styles.headerTextView}>
          <TouchableOpacity onPress={showNumberKeyboard}>
            <Text style={styles.headerText}>￥{amount || '请输入金额'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>{formatTime(currentTime)}</Text>
      </View>
      <FlatList
        data={Categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCategorySelection(item)}>
            <View style={styles.categoryItem}>
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderNumberKeyboard = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={numberKeyboardVisible}
      onRequestClose={closeNumberKeyboard}
    >
      <View style={styles.numberKeyboardModalBackground}>
        <View style={styles.numberKeyboardContent}>
          <FlatList
            data={NUMBER_KEYS}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.numberKey}
                onPress={() => handleNumberPress(item)}
              >
                <Text style={styles.numberKeyText}>
                  {item === '删除' ? '⌫' : item === '完成' ? '完成' : item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        onClose && onClose();
      }}
    >
      <View style={styles.modalBackground} />
      {renderModalContent()}
      {renderNumberKeyboard()}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  addButtonText: {
    fontSize: 18,
    color: '#000',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 35,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTextView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryText: {
    fontSize: 16,
  },
  numberKeyboardModalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  numberKeyboardContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  numberKey: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  numberKeyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PopupComponent;
