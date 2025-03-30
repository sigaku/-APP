from django.db import models
from django.conf import settings
# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from django.utils import timezone
class User(models.Model):
    username = models.CharField(verbose_name="用户名", help_text="用户名" ,max_length=32, unique=True)
    password = models.CharField(verbose_name="密码", help_text="密码", max_length=64) #需协商加密的处理
    phone = models.CharField(verbose_name="手机号码", help_text="手机号", max_length=11, unique=True)
    email = models.EmailField(verbose_name="邮箱", help_text="邮箱", blank=True, null=True)
    def __str__(self):
        return self.username

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="交易名称", help_text="交易名称") # (例如游戏充值，日常支出.etc)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="用户", help_text="用户") # 关联到用户上
    class Meta: #配置元数据
        unique_together = ('name', 'user') # 多字段组合唯一，例如(Tobbolc, 餐饮)
    def __str__(self):
        return self.name #实例化返回用户名

class Transaction(models.Model): # 交易详情
    TRANSACTION_TYPE_CHOICES = [
        (1, 'Income'),
        (2, 'Expense'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="用户", help_text="用户") #关联到用户
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, verbose_name="交易名称", help_text="交易名称(去向)") #交易的名称， 允许为空， 即交易去向被删除时不会删除交易记录本身
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="交易金额", help_text="交易金额") # 交易金额，最大长度10，小数点后两位精度
    transaction_type = models.IntegerField(choices=TRANSACTION_TYPE_CHOICES, verbose_name="交易类型", help_text="交易类型")# 交易类型，收入or支出
    description = models.TextField(blank=True, verbose_name="交易详情描述", help_text="交易详情描述") # 交易详情描述
    date = models.DateField() #交易日期
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="交易时间", help_text="交易时间") #时间戳，交易具体创建时间
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新时间", help_text="更新时间")# 每次更新会重新产生时间戳
    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.amount}" #实例化返回交易类型和金额，例如Income - 100.00
