from django.contrib import admin
from django.urls import path
from .views import home, profile, order_confirmation, thank_you, helloworld, product_viewer

urlpatterns = [
    path('admin', admin.site.urls),
    path('', home, name='home'),
    path('order_confirmation', name='order_confirmation', view=order_confirmation),
    path('thank-you', name='thank_you', view=thank_you),
    path('profile', profile),
    path('products/<slug:product_url>', product_viewer),
    path('hello', helloworld),
    # path('products/<str:product_id>', product_viewer),
]