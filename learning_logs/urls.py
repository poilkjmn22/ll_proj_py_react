"""Defines URL patterns for learning_logs."""

from django.urls import path, include
from rest_framework import routers
from . import views
from .views import HomePageView

# API路由配置
router = routers.DefaultRouter()
router.register(r'topics', views.TopicViewSet)
router.register(r'entries', views.EntryViewSet)

app_name = 'learning_logs'
urlpatterns = [
    # path('', views.index, name='index'),
    path('', HomePageView.as_view(), name='index'),  # 将首页指向 HomePageView
    # path('topics/', views.topics, name='topics'),
    # path('topics/<int:topic_id>/', views.topic, name='topic'),
    
    # API路由
    path('api/', include(router.urls)),
]