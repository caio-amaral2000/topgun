from django.db import models
from django.contrib.auth.models import AbstractUser


class Address(models.Model):
    main = models.CharField(max_length=30)
    complement = models.CharField(max_length=30, blank=True)
    postal_code = models.CharField(max_length=30)
    city = models.CharField(max_length=30)


class InstructorData(models.Model):
    graduation_date = models.DateField()
    course_name = models.CharField(max_length=30)
    institution_name = models.CharField(max_length=30)


class User(AbstractUser):
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


class Pilot(models.Model):
    license_number = models.PositiveIntegerField(unique=True, null=True)
    instructor_data = models.ForeignKey(InstructorData, on_delete=models.PROTECT, null=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    def get_flight_hours(self):
        grade_dict = {
            "A": 1,
            "B": 0.8,
            "C": 0.6,
            "D": 0.3,
            "F": 0,
            None: 1
        }
        flights = Flight.objects.filter(pilot_id=self.id)

        total_hours = 0
        for flight in flights:
            total_hours += flight.duration * grade_dict[flight.grade]
        return total_hours


class Flight(models.Model):
    GRADES = [
        ("A", "Excellent"),
        ("B", "Satisfactory"),
        ("C", "Mediocre"),
        ("D", "Insufficient"),
        ("F", "Failure"),
    ]
    start_date = models.DateField()
    duration = models.PositiveIntegerField()
    instructor = models.ForeignKey(Pilot, related_name="instructor", on_delete=models.PROTECT, null=True)
    grade = models.CharField(max_length=1, choices=GRADES, null=True)
    pilot = models.ForeignKey(Pilot, related_name="pilot", on_delete=models.PROTECT)

    class Meta:
        constraints = [
            models.CheckConstraint(
                name="flight_duration_range",
                check=models.Q(duration__range=(1, 12)),
            ),
        ]
