# Generated by Django 5.1.3 on 2024-12-05 19:45

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('molasses', '0005_product_product_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='seo_title',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='price',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(1)]),
        ),
    ]
