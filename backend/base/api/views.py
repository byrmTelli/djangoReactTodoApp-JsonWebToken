from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from base.models import Plan

from base.serializers import ProfileSerializer,PlanSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    profile = user.profile
    serializer = ProfileSerializer(profile, many=False)
    return Response(serializer.data)




@api_view(['GET'])

@permission_classes([IsAuthenticated])
def get_plan(request):
    plan = Plan.objects.all()
    plan_serializer =PlanSerializer(plan,many=True)
    
    return Response ({'plan_serializer':plan_serializer.data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_plan(request):
    serializer = PlanSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        
    return Response(serializer.data)