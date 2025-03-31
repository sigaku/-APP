from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from accounting.models import User
from accounting.serializers import UserSerializer
@api_view(["GET", "PUT", "DELETE"])
def user_profile(request, pk):
    """
    获取、更新、删除一个用户详情
    :param request:
    :param pk:
    :return:
    """
    uid = request.GET.get("id")
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