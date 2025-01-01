import requests
from decouple import config

# Facebook Conversion API Configuration
PIXEL_ID = config("FACEBOOK_PIXEL_ID")
ACCESS_TOKEN = config("CONVERSION_API_ACCESS_TOKEN")
GRAPH_API_URL = f"https://graph.facebook.com/v12.0/{PIXEL_ID}/events"

# AddToCart Event Data
# payload = {
#     "data": [
#         {
#             "event_name": "ViewContent",
#             "event_time": time.time(),
#             "action_source": "website",
#             "event_source_url": "https://jazakallah.store/",
#             "opt_out": True,
#             "user_data": {
#                 "ph": phone,
#                 "em": email,
#             },
#         }
#     ],
#     "access_token": ACCESS_TOKEN,
#     "test_event_code": "TEST29281"  # Test event code for debugging
# }
#
# load = {
#     'data': [
#         {
#             'action_source': 'website',
#             'custom_data': {
#                 'content_category': 'Organic Food',
#                 'content_ids': ['7ab51a92-7a11-478b-b6b8-6f996866ae44'],
#                 'content_name': 'পাটালি গুড়', 'content_type': 'product',
#                 'currency': 'BDT', 'num_items': 1, 'predicted_ltv': 800,
#                 'value': 400},
#             'event_id': None,
#             'event_name': 'AddToCart',
#             'event_time': 1734606129793,
#             'original_event_data': {'event_name': 'AddToCart', 'event_time': 1734606129794},
#             'user_data': {
#                 'client_ip_address': None,
#                 'client_user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
#                 'fbc': None,
#                 'fbp': 'fb.0.1734213224708.709899544819977851'
#             }
#         }
#     ],
#     'access_token': ACCESS_TOKEN,
#     'test_event_code': 'TEST97658'
# }
#
# response = requests.post(GRAPH_API_URL, json=load)
# print(response.text)


def send_event(data):
    payload = {
        "data": [
            data['data']
        ],
        "access_token": ACCESS_TOKEN,
    }
    # Send the request to Facebook's Conversion API
    response = requests.post(GRAPH_API_URL, json=payload)

    # Print the response from Facebook
    print(response.text)
