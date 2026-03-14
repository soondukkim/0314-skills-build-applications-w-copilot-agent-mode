from django.core.management.base import BaseCommand

from octofit_tracker.models import Activity, Leaderboard, Team, User, Workout


class Command(BaseCommand):
    help = 'octofit_db 데이터베이스에 테스트 데이터를 입력합니다.'

    def handle(self, *args, **options):
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        User.objects.all().delete()
        Team.objects.all().delete()

        marvel = Team.objects.create(name='marvel team', city='New York')
        dc = Team.objects.create(name='dc team', city='Gotham')

        users = [
            User.objects.create(username='Spider-Man', email='spiderman@octofit.com', age=21, team=marvel),
            User.objects.create(username='Iron Man', email='ironman@octofit.com', age=39, team=marvel),
            User.objects.create(username='Batman', email='batman@octofit.com', age=38, team=dc),
            User.objects.create(username='Wonder Woman', email='wonderwoman@octofit.com', age=31, team=dc),
        ]

        activities = [
            ('Running', 45, 380),
            ('HIIT', 30, 420),
            ('Cycling', 60, 500),
            ('Strength', 50, 360),
        ]

        for user, data in zip(users, activities):
            activity_type, duration, calories = data
            Activity.objects.create(
                user=user,
                activity_type=activity_type,
                duration_minutes=duration,
                calories_burned=calories,
            )

        leaderboard_points = [980, 920, 900, 870]
        for idx, user in enumerate(users):
            Leaderboard.objects.create(user=user, points=leaderboard_points[idx], rank=idx + 1)

        workouts = [
            ('Web Swing Cardio', 'medium', 35),
            ('Arc Reactor Circuit', 'hard', 40),
            ('Dark Knight Endurance', 'hard', 45),
            ('Amazon Core Flow', 'medium', 30),
        ]
        for user, workout in zip(users, workouts):
            title, difficulty, recommended_minutes = workout
            Workout.objects.create(
                user=user,
                title=title,
                difficulty=difficulty,
                recommended_minutes=recommended_minutes,
            )

        self.stdout.write(self.style.SUCCESS('테스트 데이터 적재가 완료되었습니다.'))
