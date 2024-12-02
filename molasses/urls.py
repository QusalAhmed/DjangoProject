from django.urls import path
from .views import home, profile, helloworld, product_viewer, google

urlpatterns = [
    path('', home, name='home'),
    path('profile', profile),
    path('hello', helloworld),
    path('products/<str:product_id>', product_viewer),
    path('google', google, name='query'),
]