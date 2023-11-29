from django.urls import path
from . import views

urlpatterns = [
    path('set-csrf-token/', views.set_csrf_token, name='set_csrf_token'),
    path('video-games/', views.get_video_games, name='get_games'),
    path('game/<int:game_id>/', views.get_game_details, name='game_details'),
    path('best-players/', views.get_best_players, name='get_best_players'),
    path('companies/', views.get_company_list, name='get_company_list'),
    path('best-players-details/<int:game_id>/', views.get_best_player_details, name='get_best_player_details'),
    path('company-details/<str:company_id>/', views.get_company_details, name='get_company_details'),
    path('chat-ai/', views.ask_AI, name='ask_AI'),
]
