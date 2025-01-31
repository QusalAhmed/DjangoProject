from django.contrib import admin
from django.urls import path
from .views import home, profile, order_confirmation, thank_you, product_viewer, EventView, IncompleteOrder, \
    UserTrackingView, test

urlpatterns = [
    path('admin', admin.site.urls),
    path('', home, name='home'),
    path('order_confirmation', name='order_confirmation', view=order_confirmation),
    path('thank-you/<uuid:order_id>', name='thank_you', view=thank_you),
    path('event/', view=EventView.as_view()),
    path('incomplete_order/', view=IncompleteOrder.as_view()),
    path('profile', profile),
    path('products/<slug:product_slug>', product_viewer, name='product_url'),
    path('track/', UserTrackingView.as_view()),
    path('test', test)
]
