import hashlib

from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from molasses.api import send_event
from molasses.form import OrderForm
from molasses.models import Product, Order, Event
from molasses.serializers import EventSerializer


def get_client_ip(request):
    """Retrieve the client's IP address from the request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class EventView(APIView):
    def post(self, request):
        client_ip = get_client_ip(request)
        serializer = EventSerializer(data=request.data, context={'ip': client_ip})

        # Validate the incoming data
        if serializer.is_valid():
            event_id = serializer.save()
            # Process the validated data
            validated_data = serializer.validated_data
            # Set event_id
            validated_data['data']['event_id'] = str(event_id)
            # Example: Log the data
            print(f"Received Data: {validated_data}")

            # Send the event data to Facebook Conversion API
            send_event(serializer.validated_data)

            # Send a successful response
            return Response({
                "message": "Data processed successfully",
                "data": validated_data,
                "event_id": str(event_id),
                "client_ip_address": client_ip
            },
                status=status.HTTP_200_OK
            )

        # Return validation errors
        return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request):
        # Get all events
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)


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
        return render(request, 'thank_you.html',
                      {
                          'order_details': order_details,
                          'customer_details': {
                                'fn': hashlib.sha256(order_details.customer_name.encode("utf-8")).hexdigest(),
                                'ph': hashlib.sha256(order_details.phone.encode("utf-8")).hexdigest(),
                                # 'address': order_details.address,
                            },
                      })
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
