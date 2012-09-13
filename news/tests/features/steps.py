import sys
import datetime 
import pytz
import time

from lettuce import step, world, before
from tornado.escape import json_decode, json_encode

sys.path.append("../")

from newebe.profile.models import UserManager
from newebe.news.models import MicroPost, MicroPostManager
from newebe.notes.models import Note
from newebe.activities.models import Activity, ActivityManager

from newebe.lib.test_util import db2, reset_documents
from newebe.lib import date_util



@before.each_scenario
def delete_posts(scenario):
    reset_documents(MicroPost, MicroPostManager.get_list)
    reset_documents(MicroPost, MicroPostManager.get_list, db2)

    reset_documents(Activity, ActivityManager.get_all)
    reset_documents(Activity, ActivityManager.get_all, db2)


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


@step(u'I send a request to retrieve the last posts')
def when_i_send_a_request_to_retrieve_the_last_posts(step):
    world.microposts = world.browser.fetch_documents("microposts/all/")
    time.sleep(0.6)
   
@step(u'And I send a request to retrieve the last posts')
def and_i_send_a_request_to_retrieve_the_last_posts(step):
    world.microposts = world.browser.fetch_documents("microposts/all/")

@step(u'Then I have (\d+) microposts ordered by date')
def then_i_have_6_microposts_ordered_by_date(step, nbposts):
    nbposts = int(nbposts)
    assert nbposts == len(world.microposts)

    for i in range(0, nbposts -1):
       assert date_util.get_date_from_db_date(world.microposts[i].get("date")) > \
               date_util.get_date_from_db_date(world.microposts[i+1].get("date")) 

@step(u'When I send a request to retrieve my last posts')
def when_i_send_a_request_to_retrieve_my_last_posts(step):
    world.microposts = world.browser.fetch_documents("microposts/mine/")

@step(u'I send a request to post a micropost')
def when_i_send_a_request_to_post_a_micropost(step):
    response = world.browser.post("microposts/all/", 
            '{"content":"test", "tags":["all"]}')
    assert 200 == response.code
    world.posted_micropost = json_decode(response.body)

@step(u'Then I have 1 micropost')
def then_i_have_1_micropost(step):
    assert len(world.microposts) == 1
    world.micropost = world.microposts[0]
    assert "test" ==  world.micropost.get("content")
    assert world.browser.user.key ==  world.micropost.get("authorKey")

@step(u'I send a request to second newebe to retrieve last posts')
def when_i_send_a_request_to_second_newebe_to_retrieve_last_posts(step):
    world.microposts = world.browser2.fetch_documents("microposts/all/")

@step(u'When I send a request to second newebe to retrieve owner last posts')
def when_i_send_a_request_to_second_newebe_to_retrieve_owner_last_posts(step):
    world.microposts = world.browser2.fetch_documents("microposts/mine/")

@step(u'And I send a delete request for this micropost')
def and_i_send_a_delete_request_for_this_micropost(step):
    micropost = world.microposts[0]
    response = world.browser.delete(
                    "microposts/{}/".format(micropost.get("_id")))
    assert 200 == response.code
    time.sleep(0.3)

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

# Retry

@step(u'And one activity for first micropost with one error for my contact')
def and_one_activity_for_first_micropost_with_one_error_for_my_contact(step):
    author = world.browser.user
    world.contact = world.browser2.user.asContact()
    world.micropost = MicroPostManager.get_list().first()
    
    world.activity = Activity(
        author = author.name,
        verb = "posts",
        docType = "micropost",
        docId = world.micropost._id,
    )
    world.activity.add_error(world.contact)
    world.activity.save()


@step(u'When I send a retry request')
def when_i_send_a_retry_request(step):
    idsDict = { "contactId": world.contact.key, 
                "activityId" : world.activity._id,
                "extra": "" }

    world.browser.post(world.micropost.get_path() + "retry/",
                      json_encode(idsDict))
    
@step(u'Then I have a micropost and an activity for it')
def then_i_have_a_micropost_and_activity_for_it(step):
    assert 1 == len(world.microposts)

    activities = world.browser2.fetch_documents("activities/all/")
    assert 1 == len(activities)


@step(u'And activity has no more errors')
def and_activity_has_no_more_errors(step):
    activity = ActivityManager.get_activity(world.activity._id)
    assert 0 == len(activity.errors)


@step(u'And add one deletion activity for first micropost with one error')
def and_add_one_deletion_activity_for_first_micropost_with_one_error(step):
    author = world.browser.user
    world.contact = world.browser2.user.asContact()
    world.micropost = MicroPostManager.get_list().first()
    
    world.activity = Activity(
        author = author.name,
        verb = "deletes",
        docType = "micropost",
        docId = world.micropost._id,
        method = "PUT"
    )
    date = date_util.get_db_date_from_date(world.micropost.date)
    world.activity.add_error(world.contact, extra=date)
    world.activity.save()

@step(u'I send a delete retry request')
def when_i_send_a_delete_retry_request(step):    
    date = world.activity.errors[0]["extra"] 
    date = date_util.get_db_date_from_date(date)
    idsDict = { "contactId": world.contact.key, 
                "activityId" : world.activity._id,
                "extra": date }

    world.browser.put(world.micropost.get_path() + "retry/",
                      json_encode(idsDict))


@step(u'When I send a new micropost with an attachment')
def when_i_send_a_new_micropost_with_an_attachment(step):
    note = Note(
        title="test note",
        content="test content",
        authorKey=world.browser2.user.key
    )
    note.save()

    data = dict()
    data["content"] = "test"
    data["tags"] = ["all"]
    data["attachments"] = [{
        "type": "Note",
        "id": note._id
    }]
    response = world.browser.post("microposts/all/", json_encode(data))
    assert 200 == response.code


@step(u'And my note is attached to it')
def and_my_note_is_attached_to_it(step):
    assert len(world.microposts) == 1
    assert world.microposts[0]["attachments"][0]["title"] == "test note"

