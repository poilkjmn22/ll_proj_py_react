from rest_framework import serializers
from .models import Topic, Entry

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'text', 'date_added']

class EntrySerializer(serializers.ModelSerializer):
    topic_detail = TopicSerializer(source='topic', read_only=True)

    class Meta:
        model = Entry
        fields = ['id', 'topic', 'topic_detail', 'text', 'date_added']