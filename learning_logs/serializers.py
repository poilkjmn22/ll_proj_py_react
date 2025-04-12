from rest_framework import serializers
from .models import Topic, Entry

class TopicSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    
    class Meta:
        model = Topic
        fields = ['id', 'text', 'date_added', 'owner']

class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ['id', 'topic', 'text', 'date_added']