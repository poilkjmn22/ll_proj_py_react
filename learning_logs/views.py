from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters
from django.views.generic import TemplateView
from django.conf import settings
from django.views import View
from django.http import HttpResponse
from rest_framework.exceptions import PermissionDenied, NotFound
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
import os

from .models import Topic, Entry
from .serializers import TopicSerializer, EntrySerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication

def index(request):
    """The home page for Learning Log."""
    return render(request, 'learning_logs/index.html')

def topics(request):
    """Show all topics."""
    topics = Topic.objects.order_by('date_added')
    context = {'topics': topics}
    return render(request, 'learning_logs/topics.html', context)

def topic(request, topic_id):
    """Show a single topic and all its entries."""
    topic = Topic.objects.get(id=topic_id)
    entries = topic.entry_set.order_by('-date_added')
    context = {'topic': topic, 'entries': entries}
    return render(request, 'learning_logs/topic.html', context)

class TopicViewSet(viewsets.ModelViewSet):
    """
    API endpoint for topics
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TopicSerializer

    def get_queryset(self):
        return Topic.objects.filter(owner=self.request.user).order_by('-date_added')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.owner != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['get'])
    def entries(self, request, pk=None):
        """获取指定topic的所有entries"""
        topic = self.get_object()  # 这里会自动检查所有权
        entries = Entry.objects.filter(topic=topic).order_by('-date_added')
        serializer = EntrySerializer(entries, many=True)
        return Response(serializer.data)

class EntryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for entries
    """
    authentication_classes = [TokenAuthentication]  # 添加认证类
    permission_classes = [IsAuthenticated]
    serializer_class = EntrySerializer

    def get_queryset(self):
        return Entry.objects.filter(topic__owner=self.request.user).order_by('-date_added')

    def perform_create(self, serializer):
        try:
            topic = Topic.objects.get(pk=self.request.data.get('topic'))
            if topic.owner != self.request.user:
                raise PermissionDenied("您没有权限在此主题下创建条目")
            serializer.save(topic=topic)
        except Topic.DoesNotExist:
            raise NotFound("主题不存在")

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.topic.owner != self.request.user:
            raise PermissionDenied("您没有权限修改此条目")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.topic.owner != self.request.user:
            raise PermissionDenied("您没有权限删除此条目")
        instance.delete()

    @action(detail=False, methods=['get'])
    def by_topic(self, request):
        """获取指定topic的所有entries"""
        topic_id = request.query_params.get('topic_id', None)
        if topic_id is not None:
            entries = Entry.objects.filter(topic_id=topic_id).order_by('-date_added')
            serializer = self.get_serializer(entries, many=True)
            return Response(serializer.data)
        return Response({'error': 'topic_id is required'}, status=400)

class HomePageView(View):
    def get(self, request):
        # 构建 index.html 的完整路径
        index_path = os.path.join(settings.BASE_DIR, '../build/client/index.html')
        with open(index_path) as f:
            return HttpResponse(f.read())

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'message': 'Please provide both username and password',
                'detail': 'Invalid credentials'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response({
                'message': 'Invalid username or password',
                'detail': 'Invalid credentials'
            }, status=status.HTTP_400_BAD_REQUEST)

        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'username': user.username,
            'message': 'Login successful'
        })