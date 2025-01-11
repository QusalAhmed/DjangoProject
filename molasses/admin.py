from django.contrib import admin

from .models import Product, Order, Event, IncompleteOrderModel, UserTracking


# Register your models here.
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'description', 'product_url']
    search_fields = ['name', 'category', 'tag']
    list_filter = ['category', 'tag']


class OrderAdmin(admin.ModelAdmin):
    list_display = ['created_at', 'completion_rate', 'order_details', 'address', 'serial']
    search_fields = ['customer_name', 'phone']
    list_filter = ['status', 'created_at']


class EventAdmin(admin.ModelAdmin):
    list_display = ['id', 'data', 'ip', 'created_at']
    search_fields = ['ip', 'created_at']
    list_filter = ['ip', 'created_at']


class IncompleteOrderModelAdmin(admin.ModelAdmin):
    list_display = ['phone', 'ip_address', 'user_id', 'created_at']
    search_fields = ['phone', 'ip_address']
    list_filter = ['created_at']


class UserTrackingAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'ip_address', 'activity_log', 'user_agent', 'created_at']
    search_fields = ['user_id', 'ip_address']
    list_filter = ['user_id', 'ip_address']


admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(IncompleteOrderModel, IncompleteOrderModelAdmin)
admin.site.register(UserTracking, UserTrackingAdmin)
