from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_jwt.views import ObtainJSONWebToken

from topgun import serializers


# Create your views here.


@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    data['profile'] = 'STU'
    data['address'] = {'main': data['main'], 'complement': data['complement'], 'postal_code': data['postal_code'],
                       'city': data['city']}

    serializer = serializers.UserRegistrationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response({"message": str(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_201_CREATED)


class LoginView(ObtainJSONWebToken):
    user_serializer_class = serializers.UserSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            user = get_user_model().objects.get(username=request.data[get_user_model().USERNAME_FIELD])
            serialized_user = self.user_serializer_class(user)
            response.data.update(serialized_user.data)
        else:
            return Response({"message": str(response.data)}, status=status.HTTP_400_BAD_REQUEST)
        return response
