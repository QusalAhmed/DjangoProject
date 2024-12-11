from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, Http404
from molasses.models import Product
from molasses.form import OrderForm


# Create your views here.
def home(request):
    products = []
    for product in Product.objects.all().order_by('rank'):
        products.append({
            "id": str(product.id),
            "name": product.name,
            "price": product.price,
            "image": product.image_url,
            "description": product.description,
        })
    return render(request, 'home.html', {
        'products': products,
        'form': OrderForm(),
    })


def order_confirmation(request):
    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            print(form.cleaned_data)
            return HttpResponseRedirect('/thank-you')
        else:
            return render(request, 'home.html', {
                'form': form,
            })
    else:
        return render(request, 'home.html', {
            'form': OrderForm(),
        })

def thank_you(request):
    return render(request, 'thank_you.html')

def profile(request):
    return render(request, 'profile.html')


def helloworld(request):
    return HttpResponse('Request method is ' + request.method)


def product_viewer(request, product_url):
    print(product_url)
    product = Product.objects.filter(product_url=product_url)
    if product:
        return render(request, 'home.html', {'products': product})
    else:
        raise Http404('Product not found')
