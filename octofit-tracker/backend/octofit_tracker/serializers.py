from rest_framework import serializers

from octofit_tracker.models import Activity, Leaderboard, Team, User, Workout


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'city']

    def get_id(self, obj):
        return str(obj.id)


class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    team_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'age', 'team', 'team_id']

    def get_id(self, obj):
        return str(obj.id)

    def get_team_id(self, obj):
        return str(obj.team_id) if obj.team_id else None


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = [
            'id',
            'user',
            'user_id',
            'activity_type',
            'duration_minutes',
            'calories_burned',
            'recorded_at',
        ]

    def get_id(self, obj):
        return str(obj.id)

    def get_user_id(self, obj):
        return str(obj.user_id)


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'user_id', 'points', 'rank']

    def get_id(self, obj):
        return str(obj.id)

    def get_user_id(self, obj):
        return str(obj.user_id)


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['id', 'user', 'user_id', 'title', 'difficulty', 'recommended_minutes']

    def get_id(self, obj):
        return str(obj.id)

    def get_user_id(self, obj):
        return str(obj.user_id)
