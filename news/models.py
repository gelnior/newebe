from django.utils import simplejson as json
from django.db import models
from couchdbkit.ext.django.schema import *

import datetime

from newebe.lib import date_util

class News(Document):
    '''
    News object used to handle news data.
    '''
    author = StringProperty()
    content = StringProperty(required=True)
    date = DateTimeProperty(default=datetime.datetime.now())
 
    def toDict(self):
         '''
         Return news as a dict object for easy json serializing.
         '''
         data = {}
         data['author'] = self.author
         data['content'] = self.content
         data['date']  = self.date.strftime(date_util.DISPLAY_DATETIME_FORMAT)

         return data

    def toJson(self):
        '''
        Return json representation of current object.
        '''
        return json.dumps(self.toDict())
