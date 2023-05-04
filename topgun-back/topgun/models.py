from django.db import models


class Address(models.Model):
    main = models.CharField(max_length=30)
    complement = models.CharField(max_length=30)
    postal_code = models.CharField(max_length=30)
    city = models.CharField(max_length=30)


class InstructorData(models.Model):
    graduation_date = models.DateField()
    course_name = models.CharField(max_length=30)
    institution_name = models.CharField(max_length=30)


class User(models.Model):
    PROFILES = [
        ("STU", "Student"),
        ("EMP", "Employee"),
        ("PIL", "Pilot"),
        ("INS", "Instructor"),
    ]
    name = models.CharField(max_length=30)
    address = models.ForeignKey(Address, on_delete=models.PROTECT)
    birth_date = models.DateField()
    profile = models.CharField(max_length=3, choices=PROFILES)
    login = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=100)


class Pilot(models.Model):
    license_number = models.IntegerField(unique=True)
    instructor_data = models.ForeignKey(InstructorData, on_delete=models.PROTECT)
    institution_name = models.CharField(max_length=30)
    user = models.ForeignKey(User, on_delete=models.PROTECT)


class Flight(models.Model):
    GRADES = [
        ("A", "Excellent"),
        ("B", "Satisfactory"),
        ("C", "Mediocre"),
        ("D", "Insufficient"),
        ("F", "Failure"),
    ]
    start_date = models.DateField()
    end_date = models.DateField()
    instructor = models.ForeignKey(Pilot, related_name="instructor", on_delete=models.PROTECT)
    grade = models.CharField(max_length=1, choices=GRADES)
    pilot = models.ForeignKey(Pilot, related_name="pilot", on_delete=models.PROTECT)
