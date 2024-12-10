# Generated by Django 5.1.3 on 2024-12-10 12:26

import django.core.validators
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('molasses', '0017_delete_product'),
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('name', models.TextField()),
                ('price', models.IntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('image_url', models.TextField()),
                ('description', models.TextField()),
                ('tag', models.CharField(max_length=50)),
                ('stock', models.IntegerField()),
                ('product_url', models.SlugField(default='', editable=False)),
                ('seo_title', models.TextField()),
                ('category', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
