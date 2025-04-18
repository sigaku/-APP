import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Image,
} from 'react-native';

// 假设分类数据，实际使用时可以根据需要调整
const Categories = [
  { id: 1, name: '生活日用'},
  { id: 2, name: '转账'},
  { id: 3, name: '消费'},
  { id: 4, name: '餐饮'},
  { id: 5, name: '娱乐'},
];

const PopupComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 使用useEffect来监听时间变化，实现时间同步本机
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 清除interval，防止内存泄漏
    return () => clearInterval(interval);
  }, []);

  // 显示弹窗
  const showModal = () => {
    setModalVisible(true);
  };

  // 处理分类选择
  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    setModalVisible(false);
  };

  // 随机选择一个分类
  const getRandomCategory = () => {
    const randomIndex = Math.floor(Math.random() * Categories.length);
    return Categories[randomIndex];
  };

  // 渲染弹窗内容
  const renderModalContent = () => (
    <View style={styles.modalContent}>
      <View style={styles.header}>
        <Text style={styles.headerText}>￥</Text>
        <Text style={styles.date}>{currentTime.toLocaleDateString()}</Text>
      </View>
      <FlatList
        data={Categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCategorySelection(item)}>
            <View style={styles.categoryItem}>
              <Image source={item.icon} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.randomButton}
        onPress={() => handleCategorySelection(getRandomCategory())}
      >
        <Text style={styles.randomButtonText}>随机选择</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showModal}>
        <Text style={styles.addButtonText}>点击添加备注</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalBackground} />
        {renderModalContent()}
      </Modal>
    </View>
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
  modal: {
    margin: 0,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 35,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
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
  date: {
    fontSize: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 18,
  },
  randomButton: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  randomButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PopupComponent;