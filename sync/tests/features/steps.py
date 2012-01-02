import sys
import time
import datetime
import hashlib

from lettuce import step, world, before

sys.path.append("../../../")

from newebe.lib.test_util import NewebeClient, db2, SECOND_NEWEBE_ROOT_URL

from newebe.profile.models import User, UserManager
from newebe.news.models import MicroPost, MicroPostManager
from newebe.contacts.models import Contact, ContactManager
from newebe.lib.slugify import slugify
from newebe.lib.test_util import reset_documents


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
    
    world.browser.post("contacts/",
                       body='{"url":"%s"}' % world.browser2.root_url)
    world.browser2.put("contacts/%s/" % slugify(world.browser.root_url.decode("utf-8")), "")



@before.each_scenario
def delete_all_posts(scenario):
    reset_documents(MicroPost, MicroPostManager.get_list)
    reset_documents(MicroPost, MicroPostManager.get_list, db2)

@step(u'Creates 5 posts on first newebe')
def creates_5_posts_on_first_newebe(step):
    for i in range(5):
        micropost = MicroPost(
            author = world.user.name,
            content = "content %s" % i,
            date = datetime.datetime.now()
        )
        time.sleep(2)
        world.browser.post("news/microposts/", micropost.toJson())


@step(u'When I Ask for synchronization')
def when_i_ask_for_synchronization(step):
    response = world.browser2.get("synchronize/")
    assert response.code == 200

@step(u'Check that 5 posts from first newebe are stored in second newebe')
def check_that_5_posts_from_first_newebe_are_stored_in_second_newebe(step):
    posts = world.browser2.fetch_documents("news/microposts/")
    import pdb
    pdb.set_trace()
    assert 5 == len(posts), posts

@step(u'Modify first newebe profile directly to DB')
def modify_first_newebe_profile_directly_to_db(step):
    world.user.description = "new description"
    world.user.save()

@step(u'Check that profile saved on second newebe is the one set on first one')
def check_that_profile_saved_on_second_newebe_is_the_one_set_on_first_one(step):
    contacts = world.browser2.fetch_documents("contacts/")
    assert 1 == len(contacts)
    contact = contacts[0]
    assert world.user.name == contact.get("name", "")

@step(u'Wait for 3 seconds')
def wait_for_3_seconds(step):
    time.sleep(3)

