import hashlib

from django.contrib.staticfiles.storage import staticfiles_storage
from django.http import HttpResponseRedirect, Http404
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from molasses.capi import send_event
from molasses.form import OrderForm
from molasses.models import Product, Order, Event, IncompleteOrderModel
from molasses.serializers import EventSerializer


# def get_client_ip(request):
#     """Retrieve the client's IP address from the request."""
#     x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#     if x_forwarded_for:
#         ip = x_forwarded_for.split(',')[0]
#     else:
#         ip = request.META.get('REMOTE_ADDR')
#     return ip


def get_client_ip_info(request):
    ip_info = {"client_ip_address": request.ipinfo.ip}
    try:
        ip_info['ct'] = getattr(request.ipinfo, 'city')
    except AttributeError:
        pass
    try:
        ip_info['st'] = getattr(request.ipinfo, 'region')
    except AttributeError:
        pass

    return ip_info


class EventView(APIView):
    @staticmethod
    def post(request):
        client_info = get_client_ip_info(request)
        client_ip = client_info['client_ip_address']
        serializer = EventSerializer(data=request.data, context={'ip': client_ip})

        # Validate the incoming data
        if serializer.is_valid():
            event_id = serializer.save()
            # Process the validated data
            validated_data = serializer.validated_data

            # Set event_id
            validated_data['data']['event_id'] = str(event_id)
            # Set client IP address
            for key, value in client_info.items():
                validated_data['data']['user_data'][key] = value
            # Example: Log the data
            print(f"Received Data: {validated_data}")

            # Send the event data to Facebook Conversion API
            send_event(serializer.validated_data)

            # Send a successful response
            return Response({
                "message": "Data processed successfully",
                "data": validated_data,
                "event_id": str(event_id),
                "client_ip_address": client_ip,
            },
                status=status.HTTP_200_OK
            )

        # Return validation errors
        return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    @staticmethod
    def get(request):
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
            "product_url": product.product_url,
        })

    # Get review image
    # List all static file paths served via the staticfiles storage
    review_files = []
    for file_path in staticfiles_storage.listdir('review_image')[1]:
        # STATICFILES_DIRS
        review_files.append(file_path)

    return render(request, 'index.html', {
        'products': products,
        'form': OrderForm(),
        'review_images': review_files
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


class IncompleteOrder(APIView):
    @staticmethod
    def post(request):
        client_info = get_client_ip_info(request)
        client_ip = client_info['client_ip_address']
        data = request.data
        phone_number = data.get('phone_number')
        user_id = request.session.get('user_id')
        if phone_number:
            IncompleteOrderModel.objects.create(phone=phone_number, ip_address=client_ip, user_id=user_id)
            return Response({
                "message": "Incomplete order processed successfully",
                "data": data,
                "client_ip_address": client_ip,
            })
        return Response(
            {"errors": "Phone number is required"},
            status=status.HTTP_400_BAD_REQUEST
        )


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
    # from django.core.mail import send_mail
    # send_mail(
    #     subject='Hello',
    #     message='Hello World',
    #     from_email='o6K3o@example.com',
    #     recipient_list=['qusalcse@gmail.com'],
    #     fail_silently=False,
    # )
    return render(request, 'profile.html')


def product_viewer(request, product_slug):
    import html2text
    product_object = Product.objects.filter(product_url=product_slug)
    if product_object.exists():
        products = []
        for product in product_object:
            products.append({
                "id": str(product.id),
                "name": product.name,
                "price": product.price,
                "image": product.image_url,
                "description": product.description,
                "description_text": html2text.html2text(product.description),
                "product_url": product.product_url,
            })

        return render(request, 'product_view.html', {
            'products': products,
            'product': products[0],
            'form': OrderForm(),
        })
    else:
        raise Http404('Product not found')
