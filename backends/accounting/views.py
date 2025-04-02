# import uuid
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from accounting.models import User
from accounting.serializers import UserSerializer,UserRegisterSerializer,UserLoginSerializer
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
        print(md5('123456'))
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