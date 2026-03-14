from django.test import TestCase
from rest_framework.test import APIClient

from octofit_tracker.models import Activity, Leaderboard, Team, User, Workout


class OctofitCollectionsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(name='marvel team', city='New York')
        self.user = User.objects.create(
            username='Spider-Man',
            email='spiderman@test.local',
            age=21,
            team=self.team,
        )
        self.activity = Activity.objects.create(
            user=self.user,
            activity_type='Running',
            duration_minutes=45,
            calories_burned=380,
        )
        self.leaderboard = Leaderboard.objects.create(user=self.user, points=980, rank=1)
        self.workout = Workout.objects.create(
            user=self.user,
            title='Web Swing Cardio',
            difficulty='medium',
            recommended_minutes=35,
        )

    def test_models_store_records_for_all_collections(self):
        self.assertEqual(Team.objects.count(), 1)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(Activity.objects.count(), 1)
        self.assertEqual(Leaderboard.objects.count(), 1)
        self.assertEqual(Workout.objects.count(), 1)

    def test_api_users_endpoint(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_api_teams_endpoint(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_api_activities_endpoint(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_api_leaderboard_endpoint(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_api_workouts_endpoint(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
