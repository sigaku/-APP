from rest_framework import serializers
from .models import User, Category, Transaction
from accounting.utils.encrypt import md5

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,  # 密码不返回给前端
        required=True,
    )
    class Meta:
        model = User
        fields = ['username', 'password', 'email']  # 需要前端提交的字段
        extra_kwargs = {
            "id":{'read_only':True},
            'password': {'write_only': True},  # 确保密码不会序列化输出
            'email': {'required': True}       # 强制邮箱必填
        }
    def create(self, validated_data):
        # 创建用户时自动加密密码
        user = User.objects.create(
            username=validated_data['username'],
            password=md5(validated_data['password']),
            email=validated_data['email']
        )
        return user

class UserLoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True
    )
    password = serializers.CharField(
        write_only=True,  # 密码不返回给前端
        required=True,
    )
    class Meta:
        model = User
        fields = ['username', 'password']  # 需要前端提交的字段
        extra_kwargs = {
            "id":{'read_only':True},
            'password': {'write_only': True},  # 确保密码不会序列化输出
        }

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'user']
        extra_kwargs = {
            'user': {'read_only': True}
        }

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'category', 'category_name', 'amount', 
                 'transaction_type', 'description', 'date', 'created_at', 'updated_at']
        extra_kwargs = {
            'user': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True}
        }
