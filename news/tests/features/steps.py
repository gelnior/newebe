import sys
import datetime 
import pytz

from lettuce import step, world, before
from tornado.httpclient import HTTPError
from tornado.escape import json_decode

sys.path.append("../../../")

from newebe.profile.models import UserManager
from newebe.news.models import MicroPost, MicroPostManager
from newebe.contacts.models import Contact, ContactManager

from newebe.lib.test_util import NewebeClient, SECOND_NEWEBE_ROOT_URL, db, \
                                 db2, reset_documents
from newebe.lib import date_util

from newebe.lib.slugify import slugify


@before.all
def set_browers():

    reset_documents(Contact, ContactManager.getContacts)
    reset_documents(Contact, ContactManager.getContacts, db2)

    world.browser = NewebeClient()
    world.browser.set_default_user()
    world.browser.login("password")

    try: 
        world.browser2 = NewebeClient()
        world.browser2.set_default_user_2(SECOND_NEWEBE_ROOT_URL)
        world.user2 = world.browser2.user
        world.browser2.login("password")

        
        world.browser.post("contacts/",
                       body='{"url":"%s"}' % world.browser2.root_url)
        world.browser2.put("contacts/%s/" % slugify(world.browser.root_url.decode("utf-8")), "")
    except HTTPError:
        print "[WARNING] Second newebe instance does not look started"
    

@before.each_scenario
def delete_posts(scenario):
    
    reset_documents(MicroPost, MicroPostManager.get_list)
    reset_documents(MicroPost, MicroPostManager.get_list, db2)



# Models

@step(u'Given there are (\d+) posts of me and (\d+) posts of my contacts')
def given_there_are_3_posts_of_and_3_posts_of_my_contacts(step, 
                                                          nbposts, 
                                                          nbcontactposts):
    nbposts = int(nbposts)
    nbcontactposts = int(nbcontactposts)

    for i in range(1, nbposts + 1):
        micropost = MicroPost()
        micropost.author = UserManager.getUser().name
        micropost.authorKey = UserManager.getUser().key
        micropost.content = "my content {}".format(i)
        micropost.date = datetime.datetime(2011, i, 01, 11, 05, 12)
        micropost.isMine = True
        micropost.save()

    for i in range(1, nbcontactposts + 1):
        micropost = MicroPost()
        micropost.author = world.user2.name
        micropost.authorKey = world.user2.key        
        micropost.content = "contact content {}".format(i)
        micropost.date = datetime.datetime(2011, i, 10, 11, 05, 12)
        micropost.isMine = False
        micropost.save()

@step(u'When I retrieve the last posts')
def when_i_retrieve_the_last_posts(step):
    world.microposts = MicroPostManager.get_list().all()


@step(u'Then I have (\d+) posts ordered by date')
def then_i_have_6_posts_ordered_by_date(step, nbposts):
    nbposts = int(nbposts)
    assert nbposts == len(world.microposts)

    for i in range(0, nbposts -1):
       assert world.microposts[i].date > world.microposts[i+1].date 

@step(u'When I retrieve my last posts')
def when_i_retrieve_my_last_posts(step):
    world.microposts = MicroPostManager.get_mine().all()

@step(u'When I retrieve a post for a given date')
def when_i_retrieve_a_post_for_a_given_date(step):
    world.micropost = MicroPostManager.get_first("2011-01-01T11:05:12Z")

@step(u'Then I have 1 post corresponding to given date')
def then_i_have_1_post_corresponding_to_given_date(step):
    assert datetime.datetime(2011, 01, 01, 11, 05, 12) == world.micropost.date

@step(u'When I retrieve a post for a given ID')
def when_i_retrieve_a_post_for_a_given_id(step):
    world.micropost_id = MicroPostManager.get_micropost(world.micropost._id)

@step(u'Then I have 1 post corresponding to given ID')
def then_i_have_1_post_corresponding_to_given_id(step):
    assert world.micropost._id == world.micropost_id._id

@step(u'When I retrieve a post for a given contact and a given date')
def when_i_retrieve_a_post_for_a_given_contact_and_a_given_date(step):
    world.micropost_contact = MicroPostManager.get_contact_micropost(
            world.user2.key, "2011-01-10T11:05:12Z")

@step(u'Then I have 1 post corresponding to given contact and date')
def then_i_have_1_post_corresponding_to_given_contact_and_date(step):
    assert world.user2.key == world.micropost_contact.authorKey
    assert datetime.datetime(2011, 01, 10, 11, 05, 12)


# Handlers


@step(u'When I send a request to retrieve the last posts')
def when_i_send_a_request_to_retrieve_the_last_posts(step):
    world.microposts = world.browser.fetch_documents("news/microposts/all/")
   
@step(u'And I send a request to retrieve the last posts')
def and_i_send_a_request_to_retrieve_the_last_posts(step):
    world.microposts = world.browser.fetch_documents("news/microposts/all/")

@step(u'Then I have (\d+) microposts ordered by date')
def then_i_have_6_microposts_ordered_by_date(step, nbposts):
    nbposts = int(nbposts)
    assert nbposts == len(world.microposts)

    for i in range(0, nbposts -1):
       assert date_util.get_date_from_db_date(world.microposts[i].get("date")) > \
               date_util.get_date_from_db_date(world.microposts[i+1].get("date")) 

@step(u'When I send a request to retrieve my last posts')
def when_i_send_a_request_to_retrieve_my_last_posts(step):
    world.microposts = world.browser.fetch_documents("news/microposts/mine/")

@step(u'When I send a request to post a micropost')
def when_i_send_a_request_to_post_a_micropost(step):
    response = world.browser.post("news/microposts/all/",                                                         '{"content":"test"}')
    assert 201 == response.code
    world.posted_micropost = json_decode(response.body)

@step(u'Then I have 1 micropost')
def then_i_have_1_micropost(step):
    assert len(world.microposts) == 1
    world.micropost = world.microposts[0]
    assert "test" ==  world.micropost.get("content")
    assert world.browser.user.key ==  world.micropost.get("authorKey")

@step(u'When I send a request to second newebe to retrieve last posts')
def when_i_send_a_request_to_second_newebe_to_retrieve_last_posts(step):
    world.microposts = world.browser2.fetch_documents("news/microposts/all/")

@step(u'When I send a request to second newebe to retrieve owner last posts')
def when_i_send_a_request_to_second_newebe_to_retrieve_owner_last_posts(step):
    world.microposts = world.browser2.fetch_documents("news/microposts/mine/")

@step(u'And I send a delete request for this micropost')
def and_i_send_a_delete_request_for_this_micropost(step):
    micropost = world.microposts[0]
    response = world.browser.delete(
                    "news/micropost/{}/".format(micropost.get("_id")))
    assert 200 == response.code

@step(u'Then I have 0 micropost')
def then_i_have_0_micropost(step):
    assert 0 == len(world.microposts)


@step(u'And this micropost has timezone date')
def and_this_micropost_has_timezone_date(step):
    world.date_micropost = world.microposts[0]
    db_micropost = MicroPostManager.get_micropost(world.date_micropost["_id"])
    
    date = date_util.get_date_from_db_date(world.date_micropost["date"])
    
    assert db_micropost.date.replace(tzinfo=pytz.utc) == \
        date_util.convert_timezone_date_to_utc(date)
        

@step(u'And this micropost has ([a-zA-Z//]+) timezone')
def and_this_micropost_has_same_date_as_the_posted_one(step, timezone):
    micropost = world.microposts[0]
    
    posted_date = date_util.get_date_from_db_date(world.date_micropost["date"])
    posted_date = date_util.convert_timezone_date_to_utc(posted_date)

    tz = pytz.timezone(timezone)
    contact_date = date_util.get_date_from_db_date(micropost["date"])
    contact_date = date_util.convert_timezone_date_to_utc(contact_date, tz)

    assert contact_date == posted_date


