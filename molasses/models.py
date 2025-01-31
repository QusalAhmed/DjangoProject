import hashlib
import json
import uuid

from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify


class Product(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    name = models.CharField(max_length=65)
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
    total = models.IntegerField(null=True, blank=True)
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
        self.total = self.subtotal + int(self.delivery_charge) - int(self.discount)

        super(Order, self).save(*args, **kwargs)


class IncompleteOrderModel(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    phone = models.CharField(max_length=15)
    event_location = models.CharField(max_length=50, null=True)
    order_details = models.JSONField(null=True)
    user_id = models.CharField(max_length=100, editable=False, null=True)
    ip_address = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)

    def save(self, *args, **kwargs):
        super(IncompleteOrderModel, self).save(*args, **kwargs)
        return self.id


class Event(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    data = models.JSONField()
    ip = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)

    def save(self, *args, **kwargs):
        super(Event, self).save(*args, **kwargs)
        return self.id


class UserTracking(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    user_id = models.CharField(max_length=100, editable=False)
    ip_address = models.GenericIPAddressField()
    activity_log = models.TextField()
    user_agent = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.ip_address)

    def save(self, *args, **kwargs):
        super(UserTracking, self).save(*args, **kwargs)
        return self.id

    class Meta:
        ordering = ['-created_at']