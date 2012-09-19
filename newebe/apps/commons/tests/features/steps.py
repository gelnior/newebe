# -*- coding: utf-8 -*-
import sys
import datetime
import time

from lettuce import step, world, before
from tornado.httpclient import HTTPError, HTTPRequest
from tornado.escape import json_encode

sys.path.append("../")

from newebe.apps.commons.models import CommonManager, Common
from newebe.apps.activities.models import ActivityManager, Activity
from newebe.apps.contacts.models import Contact, ContactManager
from newebe.lib.upload_util import encode_multipart_formdata
from newebe.lib import date_util
from newebe.lib.slugify import slugify
from newebe.lib.test_util import NewebeClient, reset_documents, \
                                 SECOND_NEWEBE_ROOT_URL, db2

@before.all
def set_browsers():

    reset_documents(Contact, ContactManager.getContacts)
    reset_documents(Contact, ContactManager.getContacts, db2)

    world.browser = NewebeClient()
    world.browser.set_default_user()
    world.browser.login("password")

    try:
        world.browser2 = NewebeClient()
        world.browser2.set_default_user_2(SECOND_NEWEBE_ROOT_URL)
        world.browser2.login("password")

        world.browser.post("contacts/all/",
                       body='{"url":"%s"}' % world.browser2.root_url)
        time.sleep(0.3)
        world.browser2.put("contacts/%s/"
                           % slugify(world.browser.root_url.decode("utf-8")),
                           "")
        time.sleep(0.3)
    except HTTPError:
        print "[WARNING] Second newebe instance does not look started"


@before.each_scenario
def delete_commons(scenario):

    reset_documents(Common, CommonManager.get_last_commons)
    reset_documents(Common, CommonManager.get_last_commons, db2)

    reset_documents(Activity, ActivityManager.get_all)
    reset_documents(Activity, ActivityManager.get_all, db2)


# Models

@step(u'When I get last commons')
def when_i_get_last_commons(step):
    world.commons = CommonManager.get_last_commons().all()


@step(u'I have three commons ordered by date')
def i_have_three_commons_ordered_by_date(step):
    assert 3 == len(world.commons)
    assert world.commons[1].date < world.commons[0].date
    assert world.commons[2].date < world.commons[1].date


@step(u'When I get first from its id')
def when_i_get_first_from_its_id(step):
    world.common = CommonManager.get_common(world.commons[0]._id)


@step(u'I have one common corresponding to id')
def i_have_one_common_correponsding_to_id(step):
    assert world.commons[0]._id == world.common._id


@step(u'When I get first from its date and author')
def when_i_get_first_from_its_date_and_author(step):
    common = world.commons[0]
    world.common = CommonManager.get_contact_common(common.authorKey,
                                date_util.get_db_date_from_date(common.date))


@step(u'When I Get my last commons')
def when_i_get_my_last_commons(step):
    world.commons = CommonManager.get_owner_last_commons().all()


@step(u'I have two commons ordered by date')
def i_have_two_commons_ordered_by_date(step):
    assert 2 == len(world.commons)
    assert world.commons[1].date < world.commons[0].date


@step(u'When I Get commons until november 2')
def when_i_get_commons_until_november_2(step):
    world.commons = CommonManager.get_last_commons(
            "2011-11-02T23:59:00Z").all()


@step(u'When I Get owner commons until november 1')
def when_i_get_owner_commons_until_november_1(step):
    world.commons = CommonManager.get_owner_last_commons(
            "2011-11-01T23:59:00Z").all()


@step(u'I have one common')
def i_have_one_common(step):
    assert 1 == len(world.commons)


# Handlers

@step(u'Clear all commons')
def clear_all_commons(step):
    commons = CommonManager.get_last_commons()
    while commons:
        for common in commons:
            common.delete()
        commons = CommonManager.get_last_commons()


@step(u'From seconde Newebe, clear all commons')
def from_seconde_newebe_clear_all_commons(step):
    try:
        commons = world.browser2.fetch_documents("commons/all/")
        while commons:
            for common in commons:
                world.browser2.delete("commons/%s/" % common["_id"])
            commons = world.browser2.fetch_documents("commons/all/")
    except HTTPError:
        print "[WARNING] Second newebe instance does not look started"


@step(u'Post a new common via the dedicated resource')
def post_a_new_common_via_the_dedicated_resource(step):
    time.sleep(1)
    file = open("apps/commons/tests/vimqrc.pdf", "r")

    (contentType, body) = encode_multipart_formdata([],
                            [("common", "vimqrc.pdf", file.read())])
    headers = {'Content-Type': contentType}
    request = HTTPRequest(url=world.browser.root_url + "commons/all/",
                          method="POST", body=body, headers=headers,
                          validate_cert=False)
    if hasattr(world.browser, "cookie"):
            request.headers["Cookie"] = world.browser.cookie
    world.browser.fetch(request)


@step(u'Retrieve last commons')
def retrieve_last_commons(step):
    world.commons = world.browser.fetch_documents("commons/all/")


@step(u'Download first returned common')
def download_first_returned_common(step):
    first_common = world.commons[0]
    world.response = world.browser.get(
        "commons/%s/%s" % (first_common["_id"],
        first_common["path"]))


@step(u'From second Newebe, download the first returned common')
def from_second_newebe_download_the_first_returned_common(step):
    first_common = world.commons[0]
    world.response = world.browser2.get(
            "commons/%s/%s" % (first_common["_id"], first_common["path"]))


@step(u'Download thumbnail of first returned common')
def download_thumbnail_of_first_returned_common(step):
    first_common = world.commons[0]
    world.response = world.browser.get(
            "commons/%s/th_%s" % (first_common["_id"],
            first_common["path"]))


@step(u'From second Newebe, download the preview of first returned common')
def from_second_newebe_download_the_preview_of_first_returned_common(step):
    first_common = world.commons[0]
    world.response = world.browser2.get(
            "commons/%s/prev_%s" % (first_common["_id"],
            first_common["path"]))


@step(u'Ensure it is the same that posted common')
def ensure_it_is_the_same_that_posted_common(step):
    file = open("apps/commons/tests/vimqrc.pdf", "r")
    assert file.read() == world.response.body


@step(u'Ensure that common date is ok with time zone')
def ensure_that_common_date_is_ok_with_time_zone(step):
    world.date_common = world.commons[0]

    common_db = CommonManager.get_common(world.date_common["_id"])
    date = date_util.convert_utc_date_to_timezone(common_db.date)
    date = date_util.get_db_date_from_date(date)

    assert world.date_common["date"] == date


@step(u'Retrieve last activities')
def retrieve_last_activities(step):
    world.activities = world.browser.fetch_documents("activities/all/")


@step(u'Check that last activity correspond to a common creation')
def check_that_last_activity_correspond_to_a_common_creation(step):
    assert len(world.activities) >= 1
    activity = world.activities[0]
    assert activity["verb"] == "publishes"
    assert activity["docType"] == "common"


@step(u'From second Newebe, retrieve commons')
def from_second_newebe_retrieve_last_commons(step):
    world.commons = []
    world.commons = world.browser2.fetch_documents("commons/all/")


@step(u'From second Newebe, retrieve activities')
def from_second_newebe_retrieve_activities(step):
    world.activities = world.browser2.fetch_documents("activities/all/")


@step(u'From second Newebe, download thumbnail of posted common')
def from_second_newebe_download_thumbnail_of_posted_common(step):
    assert 0 < len(world.commons)
    first_common = world.commons[0]
    world.response = world.browser2.get(
            "commons/%s/%s" % (first_common["_id"],
            "th_" + first_common["path"]))


@step(u'From second Newebe, posted common download fails')
def from_second_newebe_posted_common_download_fails(step):
    assert 0 < len(world.commons)
    first_common = world.commons[0]
    try:
        world.response = world.browser2.get(
            "commons/%s/%s" % (first_common["_id"],
            first_common["path"]))
    except HTTPError, error:
        assert 404 == error.code


@step(u'From second Newebe, request for download')
def from_second_newebe_request_for_download(step):
    assert 0 < len(world.commons)
    first_common = world.commons[0]
    world.response = world.browser2.get(
              "commons/{}/download/".format(first_common["_id"]))


@step(u'Add three commons to the database with different dates')
def add_three_commons_to_the_database_with_different_dates(step):
    file = open("apps/commons/tests/vimqrc.pdf")

    for i in range(1, 4):
        common = Common(
            title="Common 0%d" % i,
            author=world.browser.user.name,
            authorKey=world.browser.user.key,
            date=datetime.datetime(2011, 11, i),
            path="vimqrc.pdf",
            isMine=i != 3
        )
        common.save()
        common.put_attachment(file.read(), "vimqrc.pdf")


@step(u'Retrieve all commons through handlers')
def retrieve_all_commons_through_handlers(step):
    world.commons = world.browser.fetch_documents("commons/all/")


@step(u'Retrieve all commons before november 2, through handlers')
def retrieve_all_commons_before_november_2_through_handlers(step):
    world.commons = world.browser.fetch_documents("commons/all/2011-11-02-23-59-00/")


@step(u'Check that there is three commons with the most recent one as first common')
def check_that_there_is_three_commons_with_the_most_recent_one_as_first_common(step):
    assert 3 == len(world.commons)
    assert world.commons[1].get("date", None) <  \
            world.commons[0].get("date", None)
    assert world.commons[2].get("date", None) <  \
            world.commons[1].get("date", None)


@step(u'Retrieve first common hrough handler via its ID.')
def retrieve_first_common_hrough_handler_via_its_id(step):
    world.common = world.browser.fetch_document("commons/{}/".format(
                                        world.commons[0]["_id"]))


@step(u'Check that common title is the same that first common')
def check_that_common_title_is_the_same_that_first_common(step):
    assert world.common["rows"][0]["title"] == world.commons[0].get("title",
                                                                      "")


@step(u'Through handler delete first common')
def through_handler_delete_first_common(step):
    time.sleep(1)
    common = world.commons[0]
    world.browser.delete("commons/{}/".format(common.get("_id", "")))
    time.sleep(0.4)


@step(u'Check that there are no common')
def check_that_there_are_no_common(step):
    assert 0 == len(world.commons)


@step(u'Check that last activity correspond to a common deletion')
def check_that_last_activity_correspond_to_a_common_deletion(step):
    activity = world.activities[0]
    assert "deletes" == activity.get("verb", "")
    assert "common" == activity.get("docType", "")
    assert "DELETE" == activity.get("method", "")


@step(u'Retrieve all commons through my commons handlers')
def retrieve_all_commons_through_my_commons_handlers(step):
    world.commons = world.browser.fetch_documents("commons/mine/")


@step(u'Check that there is two commons with the most recent one as first common')
def check_that_there_is_two_commons_with_the_most_recent_one_as_first_common(step):
    assert 2 == len(world.commons)
    assert world.commons[1].get("date", None) <  \
            world.commons[0].get("date", None)


@step(u'Retrieve all owner commons before november 1, through handlers')
def retrieve_all_owner_commons_before_november_1_through_handlers(step):
    world.commons = world.browser.fetch_documents("commons/mine/2011-11-01-23-59-00/")


@step(u'Check that there is one common')
def check_that_there_is_one_common(step):
    assert 1 == len(world.commons)


@step(u'Check that date common on second newebe is the same')
def check_that_date_common_on_second_newebe_is_the_same(step):
    common = world.commons[0]
    world.date_common["date"] = common["date"]

@step(u'Check that common name is the posted common.')
def check_that_common_name_is_the_posted_common(step):
    common = world.commons[0]
    world.date_common["title"] = common["title"]

# Retry

@step(u'add one activity for first common with one error for my contact')
def and_one_activity_for_first_common_with_one_error_for_my_contact(step):
    author = world.browser.user
    world.contact = world.browser2.user.asContact()
    world.common = CommonManager.get_last_commons().first()

    world.activity = Activity(
        author=author.name,
        verb="posts",
        docType="common",
        docId=world.common._id,
    )
    world.activity.add_error(world.contact)
    world.activity.save()


@step(u'When I send a retry request')
def when_i_send_a_retry_request(step):
    idsDict = {"contactId": world.contact.key,
               "activityId": world.activity._id,
               "extra": ""}

    url = world.common.get_path() + "retry/"
    print url
    world.browser.post(url, json_encode(idsDict))


@step(u'Then I have a common and an activity for it')
def then_i_have_a_common_and_an_activity_for_it(step):
    assert 1 == len(world.commons)

    activities = world.browser2.fetch_documents("activities/all/")
    assert 1 == len(activities)


@step(u'first activity has no more errors')
def and_first_activity_has_no_more_errors(step):
    activity = ActivityManager.get_activity(world.activity._id)
    assert 0 == len(activity.errors)


@step(u'And I add one deletion activity for first common with one error')
def and_i_add_one_deletion_activity_for_first_common_with_one_error(step):
    author = world.browser.user
    world.contact = world.browser2.user.asContact()
    world.common = CommonManager.get_last_commons().first()

    world.activity = Activity(
        author=author.name,
        verb="deletes",
        docType="common",
        docId=world.common._id,
        method="PUT"
    )
    date = date_util.get_db_date_from_date(world.common.date)
    world.activity.add_error(world.contact, extra=date)
    world.activity.save()


@step(u'When I send a delete retry request')
def when_i_send_a_delete_retry_request(step):
    date = world.activity.errors[0]["extra"]
    date = date_util.get_db_date_from_date(date)
    idsDict = {"contactId": world.contact.key,
               "activityId": world.activity._id,
               "extra": date}

    world.browser.put(world.common.get_path() + "retry/",
                      json_encode(idsDict))
