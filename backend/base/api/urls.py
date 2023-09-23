from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('profile/', views.get_profile),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('data/',views.get_plan,name='get_plan'),
    path('data/add/',views.add_plan,name='add_plan'),
    path('data/edit/<int:id>/',views.edit_plan,name="edit_plan"),
    path('data/delete/<int:id>/',views.delete_plan,name="delete_plan")
]