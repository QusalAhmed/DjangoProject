# Generated by Django 5.1.3 on 2024-12-10 11:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('molasses', '0007_alter_product_product_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='tag',
            field=models.CharField(max_length=500),
        ),
    ]