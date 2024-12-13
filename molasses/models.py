import hashlib
import json
import uuid

from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify


class Product(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    name = models.TextField()
    price = models.IntegerField(validators=[MinValueValidator(1)])
    image_url = models.TextField()
    description = models.TextField()
    tag = models.CharField(max_length=50)
    stock = models.IntegerField()
    product_url = models.SlugField(default="", editable=False, unique=True, max_length=2000)
    seo_title = models.TextField()
    category = models.CharField(max_length=100)
    rank = models.CharField(max_length=100, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.product_url = slugify(self.seo_title) + '-' + hashlib.sha256(str(self.id).encode()).hexdigest()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Order(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    serial = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completion_rate = models.JSONField(null=True, editable=False)
    order_details = models.JSONField(default=dict)
    delivery_charge = models.IntegerField(null=True)
    address = models.TextField(null=True, blank=True)
    customer_name = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=15)
    location = models.CharField(max_length=50, null=True, blank=True)
    comment = models.CharField(max_length=100, null=True, blank=True)
    subtotal = models.IntegerField(null=True)
    discount = models.IntegerField(null=True)
    status = models.CharField(max_length=50, default='pending')
    log = models.JSONField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self._state.adding:  # Only set serial for new records
            last_record = Order.objects.order_by('serial').last()
            try:
                self.serial = (last_record.serial + 1) if last_record else 1
            except TypeError:
                self.serial = 1

            # Order details
            self.order_details = json.loads(self.order_details)
            order_details = {}
            for product_id in self.order_details:
                item = self.order_details[product_id]
                item['weight'] = int(item['weight'])
                try:
                    item['price'] = Product.objects.get(id=product_id).price
                except Product.DoesNotExist:
                    item['price'] = 1000
                if item['weight'] != 0:
                    order_details[product_id] = item
            self.order_details = order_details

        # Calculate total price
        subtotal = 0
        for product_id in self.order_details:
            item = self.order_details[product_id]
            subtotal += item['price'] * item['weight']
        self.subtotal = subtotal

        super(Order, self).save(*args, **kwargs)
