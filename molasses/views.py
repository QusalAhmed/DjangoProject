from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, Http404
from molasses.models import Product, Order
from molasses.form import OrderForm


# Create your views here.
def home(request):
    products = []
    for product in Product.objects.exclude(stock=0).order_by('rank'):
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
            new_order = Order(
                completion_rate={},
                order_details=form.cleaned_data['order_details'],
                delivery_charge=form.cleaned_data['delivery_charge'],
                address=form.cleaned_data['address'],
                customer_name=form.cleaned_data['name'],
                phone=form.cleaned_data['phone'],
                location=form.cleaned_data['division'],
                comment=form.cleaned_data['comment'],
                subtotal=0,
                discount=0,
                status='pending',
            )
            new_order.save()
            order_id = new_order.id
            return HttpResponseRedirect('/thank-you/' + str(order_id))
        else:
            return render(request, 'home.html', {
                'form': form,
            })
    else:
        return render(request, 'home.html', {
            'form': OrderForm(),
        })

def thank_you(request, order_id):
    try:
        order_details = Order.objects.get(id=order_id)
        return render(request, 'thank_you.html', {'order_details': order_details})
    except Order.DoesNotExist:
        raise Http404('Order not found')

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
