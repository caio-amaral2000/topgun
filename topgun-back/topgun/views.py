from django.contrib.auth import get_user_model
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_jwt.views import ObtainJSONWebToken

from topgun import serializers
from topgun.authentication import EmployeePermission, InstructorPermission
from topgun.models import Pilot, Flight


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

    serializer = serializers.FlightCreationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response({"message": str(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([EmployeePermission | InstructorPermission])
def get_users(request):
    serializer = serializers.UserSerializer

    if request.user.profile == 'EMP':
        users = get_user_model().objects.filter(Q(profile='INS') | Q(profile='PIL') | Q(profile='STU'))
        serialized_users = serializer(users, many=True)
        return Response(data=serialized_users.data, status=status.HTTP_200_OK)

    else:
        users = get_user_model().objects.filter(profile='STU')
        serialized_users = serializer(users, many=True)
        return Response(data=serialized_users.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pilot_data(request, user_id):
    user_pilot = get_user_model().objects.get(id=user_id)
    pilot = Pilot.objects.get(user_id=user_id)
    flights = Flight.objects.filter(pilot_id=pilot.id)

    serializer_user = serializers.UserSerializer
    serializer_pilot = serializers.PilotSerializer
    serializer_flight = serializers.FlightSerializer

    if request.user.profile == 'INS' and user_pilot.profile != 'STU':
        return Response({"message": 'Instructors cannot register non-student flights'},
                        status=status.HTTP_403_FORBIDDEN)
    elif request.user.profile != 'EMP' and request.user.id != user_id:
        return Response({"message": 'You cannot see the pilot data of another user'},
                        status=status.HTTP_403_FORBIDDEN)

    data = serializer_pilot(pilot).data
    data['flights'] = serializer_flight(flights, many=True).data
    data['user'] = serializer_user(user_pilot).data
    return Response(data=data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([InstructorPermission])
def get_instructed_flights(request):
    flights = Flight.objects.filter(instructor_id=request.user.id)
    serializer = serializers.FlightSerializer

    data = serializer(flights, many=True).data
    return Response(data=data, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([InstructorPermission])
def graduate_student(request, user_id):
    user_pilot = get_user_model().objects.filter(id=user_id)
    pilot = Pilot.objects.filter(user_id=user_id)

    if user_pilot[0].profile != 'STU':
        return Response({"message": "User is not a student"}, status=status.HTTP_400_BAD_REQUEST)

    if pilot.get_flight_hours() >= 150:
        pilot.update(license_number=request.data["license_number"])
        user_pilot.update(profile='PIL')
    else:
        return Response({"message": "Student has not completed the mandatory flight hours"},
                        status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([EmployeePermission])
def promote_pilot(request, user_id):
    user_pilot = get_user_model().objects.filter(id=user_id)
    pilot = Pilot.objects.filter(user_id=user_id)

    if user_pilot[0].profile != 'PIL':
        return Response({"message": "User is not a pilot"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = serializers.InstructorDataSerializer(data=request.data)
    if serializer.is_valid():
        pilot.update(instructor_data=serializer.save())
        user_pilot.update(profile='INS')
    else:
        return Response({"message": str(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_200_OK)


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
