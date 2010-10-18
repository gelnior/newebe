from django.views.decorators.csrf import csrf_protect

from django.shortcuts import render_to_response
from django.template import RequestContext

from newebe.main.models import Tweet
from newebe.main.forms import TweetForm

@csrf_protect
def home(request):
    tweet = None
    form = None
    if request.POST:
        form = TweetForm(request.POST)
    
    if form and form.is_valid():
        tweet = form.save()  
    else:
        form = TweetForm()

    tweets = Tweet.view("main/all")

    return render_to_response("home.html", {
            "form": form,
            "tweet": tweet,
            "tweets": tweets
    }, context_instance=RequestContext(request))

