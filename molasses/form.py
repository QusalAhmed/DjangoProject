from django import forms

class OrderForm(forms.Form):
    name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'normal-input',
            'placeholder': 'Enter your name'
        }),
        help_text="Provide your full name for accurate order processing.",
        required=False,
    )
    phone = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'normal-input',
            'placeholder': 'Enter your phone number',
            'required': True
        }),
        error_messages={
            'required': 'Phone number is required',
        },
        help_text="Valid formats: +880XXXXXXXXXX, 880XXXXXXXXXX, 0XXXXXXXXXX"
    )
    division = forms.ChoiceField(
        choices=[
            ('', 'Select a division'),
            ('dhaka', 'Dhaka'),
            ('chattogram', 'Chattogram'),
            ('khulna', 'Khulna'),
            ('rajshahi', 'Rajshahi'),
            ('sylhet', 'Sylhet'),
            ('barishal', 'Barishal'),
            ('rangpur', 'Rangpur'),
            ('mymensingh', 'Mymensingh'),
        ],
        widget=forms.Select(attrs={
            'class': 'normal-input',
        }),
        help_text="Select your division for delivery.",
        required=False,
    )
    address = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'normal-input',
            'placeholder': 'Enter your address',
            'rows': 4,
        }),
        help_text="Provide your detailed address for accurate delivery.",
        required=False,
    )
    comment = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'normal-input',
            'placeholder': 'Enter your comment',
            'rows': 1,
        }),
        help_text="If you want to add comment for me, write above in 100 characters.",
        required=False,
    )
    PAYMENT_METHOD_CHOICES = [
        ('Cash on Delivery', 'Cash on Delivery'),
        ('Bkash', 'Bkash'),
    ]

    payment_method = forms.ChoiceField(
        choices=PAYMENT_METHOD_CHOICES,
        widget=forms.RadioSelect(attrs={'class': 'toggle-group'}),
        initial='Cash on Delivery',  # Default option
    )
