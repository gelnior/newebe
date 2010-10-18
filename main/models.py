from django.db import models
from couchdbkit.ext.django.schema import *

import datetime


class Tweet(Document):
    author = StringProperty()
    content = StringProperty(required=True)
    date = DateTimeProperty(default=datetime.datetime.now())
 

