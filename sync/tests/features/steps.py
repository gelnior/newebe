import sys
import time
import datetime
import hashlib

from lettuce import step, world, before
from tornado.escape import json_encode

sys.path.append("../../../")

from newebe.lib.test_util import NewebeClient

from newebe.core.models import User, Contact, UserManager, ContactManager
from newebe.news.models import MicroPost
from newebe.lib.slugify import slugify

from newebe.settings import TORNADO_PORT

ROOT_URL = u"http://localhost:%d/" % TORNADO_PORT
ROOT_URL_2 = u"http://localhost:%d/" % (TORNADO_PORT + 10)

client = NewebeClient()

def delete_all_contacts_from_url(url):
    contacts = world.browser.fetch_documents_from_url(url + "contacts/")
    for contact in contacts:
         world.browser.delete(url + "contacts/" + contact.get("slug","") + "/")

def delete_all_posts_from_url(url):
    postUrl = url + "news/microposts/"
    posts = world.browser.fetch_documents_from_url(postUrl)
    while posts:
        for post in posts:
             world.browser.delete(url + "news/micropost/" + post.get("_id","") + "/")
        posts = world.browser.fetch_documents_from_url(postUrl)


@before.all
def set_browser():
    world.browser = NewebeClient()

@before.all
def set_default_user():
    user = UserManager.getUser()
    if user:
        user.delete()

    world.user = User(
        name = "John Doe",
        password = hashlib.sha224("password").hexdigest(),
        key = "key",
        authorKey = "authorKey",
        url = ROOT_URL,
        description = "my description"        
    )
    world.user.save()

@before.all
def delete_all_contacts():
    delete_all_contacts_from_url(ROOT_URL)
    delete_all_contacts_from_url(ROOT_URL_2)

@before.all
def delete_all_posts():
    delete_all_posts_from_url(ROOT_URL)
    delete_all_posts_from_url(ROOT_URL_2)


@step(u'Creates 5 posts on first newebe')
def creates_5_posts_on_first_newebe(step):
    for i in range(5):
        micropost = MicroPost(
            author = world.user.name,
            content = "content %s" % i,
            date = datetime.datetime.now()
        )
        client.post(ROOT_URL + "news/microposts/", micropost.toJson())

@step(u'Set trusted contacts on both newebe')
def set_trusted_contacts_on_both_newebe(step):
    contact = UserManager.getUser().asContact()
    response = world.browser.post(ROOT_URL_2 + 'contacts/', 
                                  contact.toJson())
    assert response.code == 201

    contact.slug = slugify(ROOT_URL_2)
    response = world.browser.put(ROOT_URL + 'contacts/' + contact.slug + "/", 
                                  contact.toJson())
    assert response.code == 200

@step(u'When I Ask for synchronization')
def when_i_ask_for_synchronization(step):
    response = world.browser.get(ROOT_URL_2 + "synchronize/")
    assert response.code == 200

@step(u'Check that 5 posts from first newebe are stored in second newebe')
def check_that_5_posts_from_first_newebe_are_stored_in_second_newebe(step):
    posts = world.browser.fetch_documents_from_url(ROOT_URL_2 + "news/microposts/")
    assert 5 == len(posts)

@step(u'Modify first newebe profile directly to DB')
def modify_first_newebe_profile_directly_to_db(step):
    world.user.description = "new description"
    world.user.save()

@step(u'Check that profile saved on second newebe is the one set on first one')
def check_that_profile_saved_on_second_newebe_is_the_one_set_on_first_one(step):
    contacts = world.browser.fetch_documents_from_url(ROOT_URL_2 + "contacts/")
    assert 1 == len(contacts)
    contact = contacts[0]
    assert world.user.name == contact.name

@step(u'Wait for 3 seconds')
def wait_for_3_seconds(step):
    time.sleep(3)
