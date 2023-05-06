import json

from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import status

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from topgun.serializers import UserRegistrationSerializer


@api_view(['POST'])
def register_user(request):
    data = json.loads(request.data['user'])
    data['profile'] = 'STU'
    serializer = UserRegistrationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.data, status=status.HTTP_201_CREATED)
