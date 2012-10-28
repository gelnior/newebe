import sys
import time
import datetime

from lettuce import step, world, before
from tornado.escape import json_encode

sys.path.append("../")

from newebe.lib.test_util import NewebeClient, db2, SECOND_NEWEBE_ROOT_URL

from newebe.apps.news.models import MicroPost, MicroPostManager
from newebe.apps.pictures.models import Picture, PictureManager
from newebe.apps.contacts.models import Contact, ContactManager
from newebe.apps.commons.models import Common, CommonManager
from newebe.lib.slugify import slugify
from newebe.lib.test_util import reset_documents

from nose.tools import assert_equals


@before.all
def set_browser():
    world.browser = NewebeClient()
    world.browser2 = NewebeClient()


@before.all
def set_default_user():
    reset_documents(Contact, ContactManager.getContacts)
    reset_documents(Contact, ContactManager.getContacts, db2)

    world.browser.set_default_user()
    world.user = world.browser.user
    world.browser2.set_default_user_2(SECOND_NEWEBE_ROOT_URL)
    world.browser.login("password")
    world.browser2.login("password")
    
    world.browser.post("contacts/all/",
                       body='{"url":"%s"}' % world.browser2.root_url)
    time.sleep(0.3)
    world.browser2.put("contacts/%s/" % slugify(world.browser.root_url.decode("utf-8")), "")



@before.each_scenario
def delete_all_posts(scenario):
    reset_documents(MicroPost, MicroPostManager.get_list)
    reset_documents(MicroPost, MicroPostManager.get_list, db2)


@before.each_scenario
def delete_all_pictures(scenario):
    reset_documents(Picture, PictureManager.get_last_pictures)
    reset_documents(Picture, PictureManager.get_last_pictures, db2)

@before.each_scenario
def delete_all_commons(scenario):
    reset_documents(Picture, CommonManager.get_last_commons)
    reset_documents(Picture, CommonManager.get_last_commons, db2)


# Microposts

@step(u'(\d) posts are created on first newebe with tag "([^"]*)"')
def posts_are_created_on_first_newebe_with_tag_tag(step, nbposts, tag):
    for i in range(int(nbposts)):
        micropost = MicroPost(
            author = world.user.name,
            authorKey = world.user.key,
            content = "content %s" % i,
            tags = [tag]
        )
        micropost.save()
        time.sleep(1)

@step(u'When I Ask for synchronization')
def when_i_ask_for_synchronization(step):
    response = world.browser2.get("synchronize/")
    assert response.code == 200

@step(u'(\d) posts from first newebe are stored in second newebe')
def check_that_5_posts_from_first_newebe_are_stored_in_second_newebe(step,
        nbposts):
    posts = world.browser2.fetch_documents("microposts/all/")
    assert_equals(len(posts), int(nbposts))

# Pictures

@step(u'(\d) pictures are created on first newebe with tag "([^"]*)"')
def and_5_pictures_are_created_on_first_newebe(step, nbpics, tag):
    file = open("./apps/pictures/tests/test.jpg")
    for i in range(1, int(nbpics) + 1):
        picture = Picture(
            title = "Pic 0%d" % i,
            author =  world.user.name,
            authorKey = world.user.key,
            date = datetime.datetime(2011, 11, i),
            path = "test.jpg",
            contentType = "image/jpeg",
            isMine = True,
            tags = [tag]
        )
        picture.save()
        picture.put_attachment(file.read(), "th_test.jpg")
        picture.save()


@step(u'(\d) pictures from first newebe are stored in second newebe')
def and_5_pictures_from_first_newebe_are_stored_in_second_newebe(step,
        nbpictures):
    pictures = world.browser2.fetch_documents("pictures/all/")
    assert_equals(len(pictures), int(nbpictures))

@step(u'My contact is tagged with "([^"]*)"')
def given_my_contact_is_tagged_with_tag(step, tag):
    data = {
        'tags': [tag]
    }
    world.browser.put(
        "contacts/%s/tags/" % slugify(world.browser2.root_url.decode("utf-8")), 
        body=json_encode(data))

# Commons

@step(u'(\d) commons are created on first newebe with tag "([^"]*)"')
def and_5_commons(step, nbcommons, tag):
    file = open("./apps/commons/tests/vimqrc.pdf")
    for i in range(1, int(nbcommons) + 1):
        common = Common(
            title = "Common 0%d" % i,
            author =  world.user.name,
            authorKey = world.user.key,
            date = datetime.datetime(2011, 11, i),
            path = "test.jpg",
            contentType = "image/jpeg",
            isMine = True,
            tags = [tag]
        )
        common.save()
        common.put_attachment(file.read(), "vimqrc.pdf")
        common.save()

@step(u'(\d) commons from first newebe are stored in second newebe')
def and_5_commons_from_first_newebe_are_stored_in_second_newebe(step,
        nbcommons):
    commons = world.browser2.fetch_documents("commons/all/")
    assert_equals(len(commons), int(nbcommons))


# Profile

@step(u'Modify first newebe profile directly to DB')
def modify_first_newebe_profile_directly_to_db(step):
    world.user.description = "new description"
    world.user.save()

@step(u'Check that profile saved on second newebe is the one set on first one')
def check_that_profile_saved_on_second_newebe_is_the_one_set_on_first_one(step):
    contacts = world.browser2.fetch_documents("contacts/all/")
    assert 1 == len(contacts)
    contact = contacts[0]
    assert world.user.name == contact.get("name", "")

@step(u'Wait for 3 seconds')
def wait_for_3_seconds(step):
    time.sleep(3)

