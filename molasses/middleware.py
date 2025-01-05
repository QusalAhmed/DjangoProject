import uuid

class UniqueUserIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if 'unique_user_id' exists in session
        if 'user_id' not in request.session:
            # Generate a unique ID
            request.session['user_id'] = 'guest-' + uuid.uuid4().hex

        response = self.get_response(request)
        return response
