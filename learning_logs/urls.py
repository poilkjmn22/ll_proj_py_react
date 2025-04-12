"""Defines URL patterns for learning_logs."""

from django.urls import path, include
from rest_framework import routers
from . import views
from .views import HomePageView, CustomAuthToken

# API路由配置
router = routers.DefaultRouter()
router.register(r'topics', views.TopicViewSet, basename='topic')
router.register(r'entries', views.EntryViewSet, basename='entry')

app_name = 'learning_logs'
urlpatterns = [
    # path('', views.index, name='index'),
    path('', HomePageView.as_view(), name='index'),  # 将首页指向 HomePageView
    # path('topics/', views.topics, name='topics'),
    # path('topics/<int:topic_id>/', views.topic, name='topic'),
    
    # API路由
    path('api/', include(router.urls)),
    path('api/accounts/login/', CustomAuthToken.as_view(), name='api_token_auth'),
]