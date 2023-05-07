import json

from django.contrib.auth import login
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from topgun import serializers


# Create your views here.


@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
def register_user(request):
    data = json.loads(request.data['user'])
    data['profile'] = 'STU'
    serializer = serializers.UserRegistrationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    # This view should be accessible also for unauthenticated users.
    permission_classes = permissions.AllowAny,

    def post(self, request, format=None):
        serializer = serializers.LoginSerializer(data=self.request.data,
                                                 context={'request': self.request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return Response(None, status=status.HTTP_202_ACCEPTED)
