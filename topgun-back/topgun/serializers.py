from rest_framework import serializers

from topgun.models import User, Address


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('main', 'complement', 'postal_code', 'city')


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
        fields = ('name', 'address', 'birth_date', 'username', 'profile')
