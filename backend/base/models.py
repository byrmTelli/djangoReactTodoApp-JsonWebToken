from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100,null=True)
    last_name = models.CharField(max_length=100,null=True)
    email = models.EmailField()

    def __str__(self):
        return self.user.username
    
#Plan Modeli Oluşturuldu. 

class Plan(models.Model):
    title = models.CharField(max_length=255)
    description=models.TextField(null=True)
    creator = models.ForeignKey(User,on_delete=models.CASCADE)
    
    def __str__(self):
        return self.title