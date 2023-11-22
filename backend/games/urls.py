from django.urls import path
from . import views

urlpatterns = [
    path('video-games/', views.get_video_games, name='get_games'),
    path('game/<int:game_id>/', views.get_game_details, name='game_details'),
    path('best-players/', views.get_best_players, name='get_best_players'),
]
