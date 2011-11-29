# -*- coding: utf-8 -*-
import sys

from lettuce import step, world, before

sys.path.append("../../../")
from newebe.settings import TORNADO_PORT
from newebe.lib.test_util import NewebeClient


SECOND_NEWEBE_ROOT_URL = u"http://localhost:%d/" % (TORNADO_PORT + 10)

@before.all
def set_browers():
    world.browser = NewebeClient()
    world.browser.set_default_user()
    world.browser.login("password")

    world.browser2 = NewebeClient()
    world.browser2.root_url = SECOND_NEWEBE_ROOT_URL
    world.browser2.login("password")

@step(u'Clear all pictures')
def clear_all_pictures(step):
    pictures = PictureManager.get_last_pictures()
    while pictures:
        for picture in pictures:
            picture.delete()
        pictures = PictureManager.get_last_pictures()
                
@step(u'From seconde Newbe, clear all pictures')
def from_seconde_newbe_clear_all_pictures(step):
    pictures = world.brower2.fetch_documents("pictures/last/")
    while pictures:
        for picture in pictures:
            world.browser2.delete("pictures/%s/" % picture["_id"])
        pictures = world.brower2.fetch_documents("pictures/last/")

@step(u'Post a new picture via the dedicated resource')
def post_a_new_picture_via_the_dedicated_resource(step):
    file = open("test.jpg", "r")
    assert False, 'This step must be implemented'

@step(u'Retrieve last pictures')
def retrieve_last_pictures(step):
    world.pictures = world.brower.fetch_documents("pictures/last/")

@step(u'Download first returned picture')
def download_first_returned_picture(step):
    assert False, 'This step must be implemented'    

@step(u'Ensure it is the same that posted picture')
def ensure_it_is_the_same_that_posted_picture(step):
    assert False, 'This step must be implemented'

@step(u'Retrieve last activities')
def retrieve_last_activities(step):
    world.activities = world.brower.fetch_documents("activities/")

@step(u'Check that last activity correspond to a picture creation')
def check_that_last_activity_correspond_to_a_picture_creation(step):
    assert len(world.activities) >= 1
    activity = world.activties[0]
    assert activity["verb"] == "posted"
    assert activity["docType"] == "Picture"

@step(u'From second Newebe, retrieve last pictures')
def from_second_newebe_retrieve_last_pictures(step):
    world.pictures = world.brower2.fetch_documents("pictures/last/")

@step(u'From second Newebe, retrieve last activities')
def from_second_newebe_retrieve_last_activities(step):
    world.activities = world.brower2.fetch_documents("activities/")

@step(u'Add three pictures to the database with different dates')
def add_three_pictures_to_the_database_with_different_dates(step):
    assert False, 'This step must be implemented'

@step(u'Retrieve all pictures through handlers')
def retrieve_all_pictures_through_handlers(step):
    assert False, 'This step must be implemented'

@step(u'Check that there is three pictures with the most recent one as first picture')
def check_that_there_is_three_pictures_with_the_most_recent_one_as_first_picture(step):
    assert False, 'This step must be implemented'

@step(u'Retrieve first picture hrough handler via its ID.')
def retrieve_first_picture_hrough_handler_via_its_id(step):
    assert False, 'This step must be implemented'

@step(u'Check that picture title is the same that first picture')
def check_that_picture_title_is_the_same_that_first_picture(step):
    assert False, 'This step must be implemented'

@step(u'Through handler delete first picture')
def through_handler_delete_first_picture(step):
    assert False, 'This step must be implemented'

@step(u'Check that there are no picture')
def check_that_there_are_no_picture(step):
    assert False, 'This step must be implemented'

@step(u'Check that last activity correspond to a picture deletion')
def check_that_last_activity_correspond_to_a_picture_deletion(step):
    assert False, 'This step must be implemented'

