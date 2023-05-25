from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_jwt.views import ObtainJSONWebToken

from topgun import serializers
from topgun.authentication import EmployeePermission, InstructorPermission
from topgun.models import Pilot


# Create your views here.


@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    data['profile'] = 'EMP'
    data['address'] = {'main': data['main'], 'complement': data['complement'], 'postal_code': data['postal_code'],
                       'city': data['city']}

    serializer = serializers.UserRegistrationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response({"message": str(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([EmployeePermission])
def create_user_pilot(request):
    data = request.data
    data['address'] = {'main': data['main'], 'complement': data['complement'], 'postal_code': data['postal_code'],
                       'city': data['city']}
    data['user'] = {'name': data['name'], 'address': data['address'], 'birth_date': data['birth_date'],
                    'username': data['username'], 'password': data['password'], 'profile': data['profile']}

    if data['profile'] == 'STU':
        if 'license_number' in data:
            return Response({"message": 'Students cannot have a license number'}, status=status.HTTP_400_BAD_REQUEST)
    elif data['profile'] == 'PIL':
        if 'license_number' not in data:
            return Response({"message": 'License number not provided'}, status=status.HTTP_400_BAD_REQUEST)
    elif data['profile'] == 'INS':
        if 'license_number' not in data:
            return Response({"message": 'License number not provided'}, status=status.HTTP_400_BAD_REQUEST)
        if 'graduation_date' in data and 'course_name' in data and 'institution_name' in data:
            data['instructor_data'] = {'graduation_date': data['graduation_date'], 'course_name': data['course_name'],
                                       'institution_name': data['institution_name']}
        else:
            return Response({"message": 'Instructor data not provided'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"message": 'Profile code not valid'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = serializers.PilotCreationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response({"message": str(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([EmployeePermission | InstructorPermission])
def create_flight(request, user_id):
    data = request.data
    user_pilot = get_user_model().objects.get(id=user_id)
    pilot_id = Pilot.objects.get(user_id=user_id).id
    data['pilot'] = pilot_id

    if user_pilot.profile == 'STU':
        if request.user.profile != 'INS' or 'grade' not in data:
            return Response({"message": 'Data provided not valid for registering a student flight'},
                            status=status.HTTP_400_BAD_REQUEST)
        data['instructor'] = request.user.id

    else:
        if request.user.profile != 'EMP' or 'grade' in data or 'instructor' in data:
            return Response({"message": 'Data provided not valid for registering a non-student flight'},
                            status=status.HTTP_400_BAD_REQUEST)

    serializer = serializers.FlightSerializer(data=data)
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
