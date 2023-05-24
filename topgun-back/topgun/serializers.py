from rest_framework import serializers

from topgun.models import User, Address, Pilot, InstructorData


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('main', 'complement', 'postal_code', 'city')


class InstructorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructorData
        fields = ('graduation_date', 'course_name', 'institution_name')


class UserRegistrationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    def create(self, validated_data):
        address = Address.objects.create(**validated_data.pop('address'))
        instance = User.objects.create_user(address=address, **validated_data)
        return instance

    class Meta:
        model = User
        fields = ('name', 'address', 'birth_date', 'username', 'password', 'profile')


class UserSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = User
        fields = ('id', 'name', 'address', 'birth_date', 'username', 'profile')


class PilotCreationSerializer(serializers.ModelSerializer):
    user = UserRegistrationSerializer()
    instructor_data = InstructorDataSerializer(required=False)

    def create(self, validated_data):
        address = Address.objects.create(**validated_data['user'].pop('address'))
        user = User.objects.create_user(**validated_data.pop('user'), address=address)
        instructor_data = InstructorData.objects.create(**validated_data.pop('instructor_data')) \
            if ('instructor_data' in validated_data) else None
        instance = Pilot.objects.create(user=user, instructor_data=instructor_data, **validated_data)
        return instance

    class Meta:
        model = Pilot
        fields = ('license_number', 'instructor_data', 'user')
