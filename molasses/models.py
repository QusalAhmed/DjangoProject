import uuid
from django.db import models
from django.core.validators import MinValueValidator
from django.utils.text import slugify
import hashlib

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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.product_url = slugify(self.seo_title) + '-' + hashlib.sha256(str(self.id).encode()).hexdigest()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
