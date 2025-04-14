# import uuid
from django.core.serializers import serialize
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from accounting.models import User, Transaction
from accounting.serializers import UserSerializer,UserRegisterSerializer,UserLoginSerializer,TransactionSerializer, TransactionGetSerializer
from django.views.decorators.csrf import csrf_exempt
from accounting.utils.encrypt import md5

@api_view(["GET", "PUT", "DELETE"])
def user_profile(request, pk):
    """
    获取、更新、删除一个用户详情
    :param request:
    :param pk:
    :return:
    """
    try: #进行异常处理
        user_detail = User.objects.get(pk=pk) #根据前端传的pk获取具体的user信息
    except User.DoesNotExist:
        return Response(data={"msg": "没有此用户"}, status=status.HTTP_404_NOT_FOUND)
    else:
        if request.method == "GET":
            s = UserSerializer(instance=user_detail)
            return Response(data=s.data, status=status.HTTP_200_OK)
        elif request.method == "PUT":
            s = UserSerializer(instance=user_detail, data=request.data) #前端传data，数据库里取instance
            if s.is_valid():  # 跟字段本身的性质有关
                s.save()  # 更新
                return Response(data=s.data, status=status.HTTP_200_OK)
        elif request.method == "DELETE":
            user_detail.delete()
            return Response(status=status.HTTP_204_NO_CONTENT )

@api_view(["POST"])
def user_register(request):
    """
    用户注册（待优化）
    :param request:
    :return:
    """
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # 调用 serializer 的 create 方法
        user_latest = User.objects.latest('id')
        return Response(
            {"error_code": 0,
                "data":{
                    "uid":user_latest.id,
                    "username":user_latest.username,
                    'name':user_latest.name,
                    'groupid':user_latest.groupid,
                    'reg_time':user_latest.reg_time,
                    'last_login_time':user_latest.last_login_time
                }
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
# @csrf_exempt
def user_login(request):
    """
    用户登录（待优化）
    :param request:
    :return:
    """
    ser = UserLoginSerializer(data=request.POST)
    if not ser.is_valid():# 验证通过
        return Response({"message": "验证失败"}, status=status.HTTP_400_BAD_REQUEST)

    username = ser.validated_data['username']
    password = ser.validated_data['password']
    #测试用户是否存在
    try:
        instance = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(
            {"message": "用户不存在", },
            status=status.HTTP_404_NOT_FOUND
        )

    #用户存在
    if md5(password) == instance.password:
        # 网站生成随机字符串，写到用户浏览器的cookie中，再写入到session中
        request.session['info_user'] = {'id': instance.id, 'username': instance.username}
        # 7天免登录
        request.session.set_expiry(60 * 60 * 24 * 7)
        return Response(
            {"error_code": 0,
                 "data": {
                     "uid": instance.id,
                     "username": instance.username,
                     'name': instance.name,
                     'groupid': instance.groupid,
                     'reg_time': instance.reg_time,
                     'last_login_time': instance.last_login_time
                 }
             },
            status=status.HTTP_200_OK
        )

    else:
        return Response({"error": "密码错误"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["POST"])
def transaction_create(request):
    """
    存储交易数据
    :param request:
    :return:
    """
    serializer = TransactionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(transaction_type=2)  # 调用 serializer 的 create 方法
        transaction_latest = Transaction.objects.latest('id')
        return Response(
            {"error_code": 0,
                # "data":{
                #     # "uid":user_latest.id,
                #     # "username":user_latest.username,
                #     # 'name':user_latest.name,
                #     # 'groupid':user_latest.groupid,
                #     # 'reg_time':user_latest.reg_time,
                #     # 'last_login_time':user_latest.last_login_time
                # }
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.generics import ListAPIView
from rest_framework.filters import OrderingFilter
class TransactionListView(ListAPIView):
    queryset = Transaction.objects.all()  # 获取所有交易记录
    serializer_class = TransactionGetSerializer  # 指定序列化器
    filter_backends = [OrderingFilter]
    ordering_fields = ['date']  # 允许按金额或日期排序
    # # 可选：添加分页（每页返回 10 条数据）
    # pagination_class = PageNumberPagination

from rest_framework.views import APIView
from django.db.models import Sum, Case, When, Value, DecimalField
from django.utils import timezone
import calendar
from datetime import date

class StatisticsAPIView(APIView):
    def get(self, request):
        # 获取当前日期（时区敏感）
        today = timezone.now().date()


        # 计算当月第一天和最后一天
        first_day = today.replace(day=1)
        _, last_day_num = calendar.monthrange(today.year, today.month)
        last_day = first_day.replace(day=last_day_num)

        # 过滤本月交易记录,此处可以也计算当日交易数据
        transactions = Transaction.objects.filter(date__range=[first_day, last_day])
        transactions1 = Transaction.objects.filter(date=date(today.year,today.month,today.day))

        # 一次性聚合计算总收入和总支出
        aggregates = transactions.aggregate(
            income_total=Sum(
                Case(
                    When(transaction_type=1, then='amount'),
                    default=Value(0),
                    output_field=DecimalField()
                )
            ),
            expense_total=Sum(
                Case(
                    When(transaction_type=2, then='amount'),
                    default=Value(0),
                    output_field=DecimalField()
                )
            )
        )
        aggregates1 = transactions1.aggregate(
            income_total_day=Sum(
                Case(
                    When(transaction_type=1, then='amount'),
                    default=Value(0),
                    output_field=DecimalField()
                )
            ),
            expense_total_day=Sum(
                Case(
                    When(transaction_type=2, then='amount'),
                    default=Value(0),
                    output_field=DecimalField()
                )
            )
        )

        # 处理聚合结果（确保非空）
        income_total = aggregates['income_total'] or 0
        expense_total = aggregates['expense_total'] or 0
        income_total_day = aggregates1['income_total_day'] or 0
        expense_total_day = aggregates1['expense_total_day'] or 0

        # 计算月结余
        balance = income_total - expense_total

        # 计算日均值（基于当月实际天数）
        month_days = last_day.day
        daily_income_avg = income_total / month_days if month_days else 0
        daily_expense_avg = expense_total / month_days if month_days else 0

        # 计算支出占比（支出/收入，百分比）
        expense_ratio = (expense_total / income_total * 100) if income_total else 0.0

        # 构造响应数据（保留两位小数）
        data = {
            "monthly_income": round(float(income_total), 2),
            "monthly_expense": round(float(expense_total), 2),
            "today_income": round(float(income_total_day), 2),
            "today_expense": round(float(expense_total_day), 2),
            "daily_income_avg": round(float(daily_income_avg), 2),
            "daily_expense_avg": round(float(daily_expense_avg), 2),
            "monthly_balance": round(float(balance), 2),
            "expense_ratio": round(float(expense_ratio), 2)
        }

        return Response(data,status=status.HTTP_200_OK)