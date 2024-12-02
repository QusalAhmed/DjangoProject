from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse


# Create your views here.
def home(request):
    return render(request, 'home.html', {'data': 'Hello, World!'})

def profile(request):
    return render(request, 'profile.html')

def helloworld(request):
    return HttpResponse('Request method is ' + request.method)

def product_viewer(request, product_id):
    return HttpResponse('Product id is ' + product_id)


def google(request):
    url = reverse('query')
    print(url)
    return HttpResponseRedirect('https://www.google.com')