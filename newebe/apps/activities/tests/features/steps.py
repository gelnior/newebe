import sys
import datetime
import pytz

from lettuce import step, world, before

sys.path.append("../")

from newebe.apps.activities.models import Activity, ActivityManager
from newebe.apps.contacts.models import Contact
from newebe.lib.test_util import NewebeClient
from newebe.lib import date_util


@before.all
def set_browser():
    world.browser = NewebeClient()
    world.browser.set_default_user()
    world.browser.login("password")


@step('Take the default activity')
def get_default_activity(step):

    if not hasattr(world, "activity"):
        world.activity = Activity(
            author="me",
            docId="aaavvvbbbb",
            verb="write",
            method="POST",
            isMine=False,
            errors=[],
            docType="Micropost",
            date=datetime.datetime(2010, 9, 01, 11, 05, 12)
        )


@step('Take the default contact')
def get_default_contact(step):

    if not hasattr(world, "contact"):
        world.contact = Contact(
            name="My contact",
            key="contact_key",
            url="contact_url",
            state="TRUSTED",
            slug="contact_url"
        )


@step('Add an error for this contact to the activity')
def add_error_to_contact(step):

    world.activity.add_error(world.contact)


@step(u'Assert that activity error infos are the same as contact info.')
def assert_that_activity_error_infos_are_the_same_as_contact_info(step):

    assert world.activity.errors

    error = world.activity.errors[0]

    assert error["contactKey"] == world.contact.key
    assert error["contactName"] == world.contact.name
    assert error["contactUrl"] == world.contact.url


@step(u'Save current activity')
def save_current_activity(step):

    world.activity.save()


@step(u'Get activity with default activity id')
def get_activity_with_default_activity_id(step):

    world.new_activity = ActivityManager.get_activity(world.activity._id)
    assert world.new_activity is not None


@step(u'Assert that current activity is the same as retrieved activity')
def assert_that_current_activity_is_the_same_as_retrieved_activity(step):
    assert world.activity.docType == world.new_activity.docType
    assert world.activity._id == world.new_activity._id
    assert world.activity.date == world.new_activity.date
    assert world.activity.verb == world.new_activity.verb


@step(u'Clear all activities from database')
def clear_all_activities_from_database(step):

    activities = ActivityManager.get_all()
    while activities:
        for activity in activities:
            activity.delete()
        activities = ActivityManager.get_all()


@step(u'Retrieve last activities')
def retrieve_last_activities(step):
    world.activities = ActivityManager.get_all()


@step(u'Assert that there is 0 activities retrieved.')
def assert_that_there_is_0_activities_retrieved(step):
    assert not world.activities


@step(u'Creates (\d+) activities - (\d+) for owner, at ([0-9A-Za-z-:]+)')
def creates_x_activities(step, nb_activities, nb_owner_activities, date):
    for i in range(int(nb_activities)):
        activity = Activity(
            author="me",
            docId="aaavvvbbbb%d" % i,
            verb="write",
            method="POST",
            isMine=i < int(nb_owner_activities),
            errors=[],
            docType="micropost",
            date=date_util.get_date_from_db_date(date)
        )
        activity.save()


@step(u'Assert that there is (\d+) activities retrieved.')
def assert_that_there_is_x_activities_retrieved(step, nb_activities):
    assert int(nb_activities) == len(world.activities), "%d should be %d" % \
    (int(nb_activities), len(world.activities))


@step(u'Retrieve owner last activities')
def retrieve_last_activities_of_owner(step):
    world.activities = ActivityManager.get_mine()


@step(u'Retrieve activities from ([0-9A-Za-z-:]+)')
def retrieve_activities_from_date(step, date):
    world.activities = ActivityManager.get_all(date)


@step(u'Retrieve owner activities from ([0-9A-Za-z-:]+)')
def retrieve_owner_activities_from_date(step, date):
    world.activities = ActivityManager.get_mine(date)


@step(u'Get last activities from handler')
def get_last_activities_from_handler(step):
    world.data = world.browser.fetch_documents_from_url("activities/all/")


@step(u'Get last activities of owner from handler')
def get_last_activities_owner_from_handler(step):
    world.data = world.browser.fetch_documents_from_url("activities/mine/")


@step(u'Assert that there are, from handler, (\d+) activities retrieved')
def assert_that_there_are_from_handler_x_activities_retrieved(step,
                                                              nb_activities):
    assert int(nb_activities) == len(world.data)


@step(u'Get activities until ([0-9-]+) from handler')
def get_activities_until_date_from_handler(step, url_date):
    world.data = world.browser.fetch_documents_from_url(
            "activities/all/" + url_date + "/")


@step(u'Get owner activities until ([0-9-]+) from handler')
def get_owner_activities_until_date_from_handler(step, url_date):
    world.data = world.browser.fetch_documents_from_url(
            "activities/mine/" + url_date + "/")


@step(u'Creates one activity')
def creates_one_activity(step):
    world.activity = Activity(
        author="me",
        docId="aaavvvbbbb%d",
        verb="writes",
        method="POST",
        isMine=True,
        errors=[],
        docType="micropost"
    )
    world.activity.save()


@step(u'Then My activity date is converted to my timezone')
def then_my_activity_date_is_converted_to_my_timezone(step):
    assert 0 < len(world.data)
    date = world.data[0].get("date")
    date = date_util.get_date_from_db_date(date)
    date = date_util.convert_timezone_date_to_utc(date)

    assert world.activity.date.replace(tzinfo=pytz.utc) == date, date
