from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters import rest_framework as filters

from .models import Topic, Entry
from .serializers import TopicSerializer, EntrySerializer


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
    queryset = Topic.objects.all().order_by('-date_added')
    serializer_class = TopicSerializer

    @action(detail=True, methods=['get'])
    def entries(self, request, pk=None):
        """获取指定topic的所有entries"""
        topic = self.get_object()
        entries = Entry.objects.filter(topic=topic).order_by('-date_added')
        serializer = EntrySerializer(entries, many=True)
        return Response(serializer.data)

class EntryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for entries
    """
    queryset = Entry.objects.all().order_by('-date_added')
    serializer_class = EntrySerializer
    filterset_fields = ['topic']  # 添加过滤字段

    @action(detail=False, methods=['get'])
    def by_topic(self, request):
        """获取指定topic的所有entries"""
        topic_id = request.query_params.get('topic_id', None)
        if topic_id is not None:
            entries = Entry.objects.filter(topic_id=topic_id).order_by('-date_added')
            serializer = self.get_serializer(entries, many=True)
            return Response(serializer.data)
        return Response({'error': 'topic_id is required'}, status=400)