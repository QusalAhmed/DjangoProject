from django.contrib import admin
from .models import Product

# Register your models here.
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'description']
    search_fields = ['name', 'category', 'tag']
    list_filter = ['category', 'tag']

admin.site.register(Product, ProductAdmin)