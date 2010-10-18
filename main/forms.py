from couchdbkit.ext.django.forms import DocumentForm
from newebe.main.models import Tweet

class TweetForm(DocumentForm):    
     class Meta:
         document = Tweet
