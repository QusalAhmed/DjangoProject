# Generated by Django 5.1.3 on 2024-12-05 08:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('molasses', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='category',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
