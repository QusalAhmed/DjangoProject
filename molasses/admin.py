from django.contrib import admin
from .models import Product, Order

# Register your models here.
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'description']
    search_fields = ['name', 'category', 'tag']
    list_filter = ['category', 'tag']

class OrderAdmin(admin.ModelAdmin):
    list_display = ['created_at', 'completion_rate', 'order_details', 'address', 'serial']
    search_fields = ['customer_name', 'phone']
    list_filter = ['status', 'created_at']

admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)