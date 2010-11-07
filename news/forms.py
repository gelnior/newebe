from couchdbkit.ext.django.forms import DocumentForm
from newebe.news.models import News


class NewsForm(DocumentForm):
     '''
     Django form for news object handling post handling.
     '''
     class Meta:
         document = News
        
