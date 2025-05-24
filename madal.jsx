import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';

// 导入图片资源
import lifeImage from '../app.UI/life.png';
import invastImage from '../app.UI/invast.png';
import transportImage from '../app.UI/transport.png';
import foodImage from '../app.UI/food.png';
import entertainmentImage from '../app.UI/entertainment.png';

const Categories = [
  { id: 1, name: '生活', image: lifeImage },
  { id: 2, name: '购物', image: invastImage },
  { id: 3, name: '出行', image: transportImage },
  { id: 4, name: '餐饮', image: foodImage },
  { id: 5, name: '娱乐', image: entertainmentImage },
];

const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '完成', '0', '删除'];

const PopupComponent = ({ visible, onClose, onAmountEntered, onDataSent }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [numberKeyboardVisible, setNumberKeyboardVisible] = useState(false);
  const [category, setCategory] = useState(null);
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false); // 新增状态
  const [username, setUsername] = useState('12346'); // 新增状态，固定为 '12346'

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    setCategory(category);
    setModalVisible(false);
    onClose && onClose();
  };

  const handleNumberPress = (number) => {
    if (number === '删除') {
      setAmount((prevAmount) => prevAmount.slice(0, -1));
    } else if (number === '完成') {
      if (onAmountEntered) {
        onAmountEntered(amount);
      }
      closeNumberKeyboard();
    } else {
      // 只允许数字和小数点
      if (number === '.' && amount.includes('.')) return;
      if (!/^\d*\.?\d*$/.test(number)) return;
      setAmount((prevAmount) => prevAmount + number);
    }
  };

  const handleSubmit = async () => {
    // 检查是否选择了分类和输入了金额
    if (!category) {
      Alert.alert('错误', '请选择一个分类');
      return;
    }
    if (!amount) {
      Alert.alert('错误', '请输入金额');
      return;
    }

    const data = {
      amount: parseFloat(amount),
      category: category.name,
      timestamp: date.toISOString(),
      username: username, // 添加 username 到数据中
    };

    setIsSending(true); // 开始发送

    try {
      const response = await fetch(' https://0e74-223-104-194-124.ngrok-free.app/api/transaction/create/', { // 确保 URL 正确
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_JWT_TOKEN`, // 如果需要认证
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '网络响应不是OK');
      }

      const responseData = await response.json();
      Alert.alert('成功', '数据已成功发送');
      console.log(responseData);
      onDataSent && onDataSent(responseData);
    } catch (error) {
      Alert.alert('错误', '发送数据时出错');
      console.error(error);
    } finally {
      setIsSending(false); // 发送完成
    }
  };

  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <View style={styles.header}>
        <View style={styles.headerTextView}>
          <TouchableOpacity onPress={showNumberKeyboard} accessibilityLabel="输入金额" accessibilityHint="点击以输入金额">
            <Text style={styles.headerText}>￥{amount || '请输入金额'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>{formatTime(date)}</Text>
      </View>
      <FlatList
        data={Categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCategorySelection(item)}
            style={styles.categoryItem}
            accessibilityLabel={`选择分类 ${item.name}`}
            accessibilityHint="点击以选择该分类"
          >
            <View style={styles.categoryContent}>
              <Image source={item.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* 新增的完成按钮 */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.completeButton}
        accessibilityLabel="完成"
        accessibilityHint="点击以完成并发送数据"
      >
        <Text style={styles.completeButtonText}>完成</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNumberKeyboard = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={numberKeyboardVisible}
      onRequestClose={closeNumberKeyboard}
      accessibilityLabel="数字键盘"
      accessibilityHint="用于输入金额的数字键盘"
    >
      <View style={styles.numberKeyboardModalBackground}>
        <View style={styles.numberKeyboardContent}>
          <FlatList
            data={NUMBER_KEYS}
            keyExtractor={(item, index) => index.toString()}
            numColumns="3"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.numberKey}
                onPress={() => handleNumberPress(item)}
                accessibilityLabel={item === '删除' ? '删除' : item === '完成' ? '完成' : item}
                accessibilityHint={item === '删除' ? '点击以删除最后一个字符' : item === '完成' ? '点击以完成输入' : `点击以输入 ${item}`}
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
      accessibilityLabel="分类选择"
      accessibilityHint="用于选择分类的模态框"
    >
      <View style={styles.modalBackground} />
      {renderModalContent()}
      {renderNumberKeyboard()}
      {isSending && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>发送中...</Text>
        </View>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryImage: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  categoryText: {
    fontSize: 16,
  },
  completeButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 18,
  },
});

export default PopupComponent;
