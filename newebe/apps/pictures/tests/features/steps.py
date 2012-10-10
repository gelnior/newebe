# -*- coding: utf-8 -*-
import sys
import datetime
import time

from PIL import Image
from lettuce import step, world, before
from tornado.httpclient import HTTPError, HTTPRequest
from tornado.escape import json_encode

sys.path.append("../")

from newebe.apps.pictures.models import PictureManager, Picture
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
    except HTTPError:
        print "[WARNING] Second newebe instance does not look started"


@before.each_scenario
def delete_pictures(scenario):

    reset_documents(Picture, PictureManager.get_last_pictures)
    reset_documents(Picture, PictureManager.get_last_pictures, db2)

    reset_documents(Activity, ActivityManager.get_all)
    reset_documents(Activity, ActivityManager.get_all, db2)


# Models

@step(u'When I get last pictures')
def when_i_get_last_pictures(step):
    world.pictures = PictureManager.get_last_pictures().all()


@step(u'I have three pictures ordered by date')
def i_have_three_pictures_ordered_by_date(step):
    assert 3 == len(world.pictures)
    assert world.pictures[1].date < world.pictures[0].date
    assert world.pictures[2].date < world.pictures[1].date


@step(u'When I get first from its id')
def when_i_get_first_from_its_id(step):
    world.picture = PictureManager.get_picture(world.pictures[0]._id)


@step(u'I have one picture corresponding to id')
def i_have_one_picture_correponsding_to_id(step):
    assert world.pictures[0]._id == world.picture._id


@step(u'When I get first from its date and author')
def when_i_get_first_from_its_date_and_author(step):
    picture = world.pictures[0]
    world.picture = PictureManager.get_contact_picture(picture.authorKey,
                                date_util.get_db_date_from_date(picture.date))


@step(u'When I Get my last pictures')
def when_i_get_my_last_pictures(step):
    world.pictures = PictureManager.get_owner_last_pictures().all()


@step(u'I have two pictures ordered by date')
def i_have_two_pictures_ordered_by_date(step):
    assert 2 == len(world.pictures)
    assert world.pictures[1].date < world.pictures[0].date


@step(u'When I Get pictures until november 2')
def when_i_get_pictures_until_november_2(step):
    world.pictures = PictureManager.get_last_pictures(
            "2011-11-02T23:59:00Z").all()


@step(u'When I Get owner pictures until november 1')
def when_i_get_owner_pictures_until_november_1(step):
    world.pictures = PictureManager.get_owner_last_pictures(
            "2011-11-01T23:59:00Z").all()


@step(u'I have one picture')
def i_have_one_picture(step):
    assert 1 == len(world.pictures)


# Handlers

@step(u'Clear all pictures')
def clear_all_pictures(step):
    pictures = PictureManager.get_last_pictures()
    while pictures:
        for picture in pictures:
            picture.delete()
        pictures = PictureManager.get_last_pictures()


@step(u'From seconde Newebe, clear all pictures')
def from_seconde_newebe_clear_all_pictures(step):
    try:
        pictures = world.browser2.fetch_documents("pictures/last/")
        while pictures:
            for picture in pictures:
                world.browser2.delete("pictures/%s/" % picture["_id"])
            pictures = world.browser2.fetch_documents("pictures/all/")
    except HTTPError:
        print "[WARNING] Second newebe instance does not look started"


@step(u'Post a new picture via the dedicated resource')
def post_a_new_picture_via_the_dedicated_resource(step):
    time.sleep(1)
    file = open("apps/pictures/tests/test.jpg", "r")

    (contentType, body) = encode_multipart_formdata([],
                            [("picture", "test.jpg", file.read())])
    headers = {'Content-Type': contentType}
    request = HTTPRequest(url=world.browser.root_url + "pictures/all/",
                          method="POST", body=body, headers=headers,
                          validate_cert=False)
    if hasattr(world.browser, "cookie"):
            request.headers["Cookie"] = world.browser.cookie
    world.browser.fetch(request)


@step(u'Retrieve last pictures')
def retrieve_last_pictures(step):
    world.pictures = world.browser.fetch_documents("pictures/all/")


@step(u'Download first returned picture')
def download_first_returned_picture(step):
    first_picture = world.pictures[0]
    world.response = world.browser.get(
        "pictures/%s/%s" % (first_picture["_id"],
        first_picture["path"]))


@step(u'From second Newebe, download the first returned picture')
def from_second_newebe_download_the_first_returned_picture(step):
    first_picture = world.pictures[0]
    world.response = world.browser2.get(
            "pictures/%s/%s" % (first_picture["_id"], first_picture["path"]))


@step(u'Download thumbnail of first returned picture')
def download_thumbnail_of_first_returned_picture(step):
    first_picture = world.pictures[0]
    world.response = world.browser.get(
            "pictures/%s/th_%s" % (first_picture["_id"],
            first_picture["path"]))


@step(u'Check that thumbnail is the posted picture thumbnail')
def check_that_thumbnail_is_the_posted_picture_thumbnail(step):
    size = 200, 200
    image = Image.open("apps/pictures/tests/test.jpg")
    image.thumbnail(size, Image.ANTIALIAS)

    file = open("apps/pictures/tests/th_test.jpg", "w")
    file.write(world.response.body)
    file.close()
    thumbnail = Image.open("apps/pictures/tests/th_test.jpg")

    assert image.getbbox() == thumbnail.getbbox()


@step(u'Download preview of first returned picture')
def download_preview_of_first_returned_picture(step):
    first_picture = world.pictures[0]
    world.response = world.browser.get(
            "pictures/%s/prev_%s" % (first_picture["_id"],
            first_picture["path"]))


@step(u'From second Newebe, download the preview of first returned picture')
def from_second_newebe_download_the_preview_of_first_returned_picture(step):
    first_picture = world.pictures[0]
    world.response = world.browser2.get(
            "pictures/%s/prev_%s" % (first_picture["_id"],
            first_picture["path"]))


@step(u'Check that preview is the posted picture preview')
def check_that_preview_is_the_posted_picture_preview(step):
    size = 1000, 1000
    image = Image.open("apps/pictures/tests/test.jpg")
    image.thumbnail(size, Image.ANTIALIAS)

    file = open("apps/pictures/tests/prev_test.jpg", "w")
    file.write(world.response.body)
    file.close()
    preview = Image.open("apps/pictures/tests/prev_test.jpg")

    assert image.getbbox() == preview.getbbox()


@step(u'Ensure it is the same that posted picture')
def ensure_it_is_the_same_that_posted_picture(step):
    file = open("apps/pictures/tests/test.jpg", "r")
    assert file.read() == world.response.body


@step(u'Ensure that picture date is ok with time zone')
def ensure_that_picture_date_is_ok_with_time_zone(step):
    world.date_picture = world.pictures[0]

    picture_db = PictureManager.get_picture(world.date_picture["_id"])
    date = date_util.convert_utc_date_to_timezone(picture_db.date)
    date = date_util.get_db_date_from_date(date)

    assert world.date_picture["date"] == date


@step(u'Retrieve last activities')
def retrieve_last_activities(step):
    world.activities = world.browser.fetch_documents("activities/all/")


@step(u'Check that last activity correspond to a picture creation')
def check_that_last_activity_correspond_to_a_picture_creation(step):
    assert len(world.activities) >= 1
    activity = world.activities[0]
    assert activity["verb"] == "publishes"
    assert activity["docType"] == "picture"


@step(u'From second Newebe, retrieve pictures')
def from_second_newebe_retrieve_last_pictures(step):
    world.pictures = []
    world.pictures = world.browser2.fetch_documents("pictures/all/")


@step(u'From second Newebe, retrieve activities')
def from_second_newebe_retrieve_activities(step):
    world.activities = world.browser2.fetch_documents("activities/all/")


@step(u'From second Newebe, download thumbnail of posted picture')
def from_second_newebe_download_thumbnail_of_posted_picture(step):
    assert 0 < len(world.pictures)
    first_picture = world.pictures[0]
    world.response = world.browser2.get(
            "pictures/%s/%s" % (first_picture["_id"],
            "th_" + first_picture["path"]))


@step(u'From second Newebe, posted picture download fails')
def from_second_newebe_posted_picture_download_fails(step):
    assert 0 < len(world.pictures)
    first_picture = world.pictures[0]
    try:
        world.response = world.browser2.get(
            "pictures/%s/%s" % (first_picture["_id"],
            first_picture["path"]))
    except HTTPError, error:
        assert 404 == error.code


@step(u'From second Newebe, request for download')
def from_second_newebe_request_for_download(step):
    assert 0 < len(world.pictures)
    first_picture = world.pictures[0]
    world.response = world.browser2.get(
              "pictures/{}/download/".format(first_picture["_id"]))


@step(u'Add three pictures to the database with different dates')
def add_three_pictures_to_the_database_with_different_dates(step):
    size = 200, 200
    image = Image.open("apps/pictures/tests/test.jpg")
    image.thumbnail(size, Image.ANTIALIAS)
    image.save("apps/pictures/tests/th_test.jpg")
    file = open("apps/pictures/tests/th_test.jpg")

    for i in range(1, 4):
        picture = Picture(
            title="Pic 0%d" % i,
            author=world.browser.user.name,
            authorKey=world.browser.user.key,
            date=datetime.datetime(2011, 11, i),
            path="test.jpg",
            isMine=i != 3
        )
        picture.save()
        picture.put_attachment(file.read(), "th_test.jpg")


@step(u'Retrieve all pictures through handlers')
def retrieve_all_pictures_through_handlers(step):
    world.pictures = world.browser.fetch_documents("pictures/all/")


@step(u'Retrieve all pictures before november 2, through handlers')
def retrieve_all_pictures_before_november_2_through_handlers(step):
    world.pictures = world.browser.fetch_documents("pictures/all/2011-11-02-23-59-00/")


@step(u'Check that there is three pictures with the most recent one as first picture')
def check_that_there_is_three_pictures_with_the_most_recent_one_as_first_picture(step):
    assert 3 == len(world.pictures)
    assert world.pictures[1].get("date", None) <  \
            world.pictures[0].get("date", None)
    assert world.pictures[2].get("date", None) <  \
            world.pictures[1].get("date", None)


@step(u'Retrieve first picture hrough handler via its ID.')
def retrieve_first_picture_hrough_handler_via_its_id(step):
    world.picture = world.browser.fetch_document("pictures/{}/".format(
                                        world.pictures[0]["_id"]))


@step(u'Check that picture title is the same that first picture')
def check_that_picture_title_is_the_same_that_first_picture(step):
    assert world.picture["rows"][0]["title"] == world.pictures[0].get("title",
                                                                      "")


@step(u'Through handler delete first picture')
def through_handler_delete_first_picture(step):
    time.sleep(1)
    picture = world.pictures[0]
    world.browser.delete("pictures/{}/".format(picture.get("_id", "")))
    time.sleep(0.4)


@step(u'Check that there are no picture')
def check_that_there_are_no_picture(step):
    assert 0 == len(world.pictures)


@step(u'Check that last activity correspond to a picture deletion')
def check_that_last_activity_correspond_to_a_picture_deletion(step):
    activity = world.activities[0]
    assert "deletes" == activity.get("verb", "")
    assert "picture" == activity.get("docType", "")
    assert "DELETE" == activity.get("method", "")


@step(u'Retrieve all pictures through my pictures handlers')
def retrieve_all_pictures_through_my_pictures_handlers(step):
    world.pictures = world.browser.fetch_documents("pictures/mine/")


@step(u'Check that there is two pictures with the most recent one as first picture')
def check_that_there_is_two_pictures_with_the_most_recent_one_as_first_picture(step):
    assert 2 == len(world.pictures)
    assert world.pictures[1].get("date", None) <  \
            world.pictures[0].get("date", None)


@step(u'Retrieve all owner pictures before november 1, through handlers')
def retrieve_all_owner_pictures_before_november_1_through_handlers(step):
    world.pictures = world.browser.fetch_documents("pictures/mine/2011-11-01-23-59-00/")


@step(u'Check that there is one picture')
def check_that_there_is_one_picture(step):
    assert 1 == len(world.pictures)


@step(u'Check that date picture on second newebe is the same')
def check_that_date_picture_on_second_newebe_is_the_same(step):
    picture = world.pictures[0]
    world.date_picture["date"] = picture["date"]


# Retry

@step(u'add one activity for first picture with one error for my contact')
def and_one_activity_for_first_picture_with_one_error_for_my_contact(step):
    author = world.browser.user
    world.contact = world.browser2.user.asContact()
    world.picture = PictureManager.get_last_pictures().first()

    world.activity = Activity(
        author=author.name,
        verb="posts",
        docType="picture",
        docId=world.picture._id,
    )
    world.activity.add_error(world.contact)
    world.activity.save()


@step(u'When I send a retry request')
def when_i_send_a_retry_request(step):
    idsDict = {"contactId": world.contact.key,
               "activityId": world.activity._id,
               "extra": ""}

    url = world.picture.get_path() + "retry/"
    print url
    world.browser.post(url, json_encode(idsDict))


@step(u'Then I have a picture and an activity for it')
def then_i_have_a_picture_and_an_activity_for_it(step):
    assert 1 == len(world.pictures)

    activities = world.browser2.fetch_documents("activities/all/")
    assert 1 == len(activities)


@step(u'first activity has no more errors')
def and_first_activity_has_no_more_errors(step):
    activity = ActivityManager.get_activity(world.activity._id)
    assert 0 == len(activity.errors)


@step(u'And I add one deletion activity for first picture with one error')
def and_i_add_one_deletion_activity_for_first_picture_with_one_error(step):
    author = world.browser.user
    world.contact = world.browser2.user.asContact()
    world.picture = PictureManager.get_last_pictures().first()

    world.activity = Activity(
        author=author.name,
        verb="deletes",
        docType="picture",
        docId=world.picture._id,
        method="PUT"
    )
    date = date_util.get_db_date_from_date(world.picture.date)
    world.activity.add_error(world.contact, extra=date)
    world.activity.save()


@step(u'When I send a delete retry request')
def when_i_send_a_delete_retry_request(step):
    date = world.activity.errors[0]["extra"]
    date = date_util.get_db_date_from_date(date)
    idsDict = {"contactId": world.contact.key,
               "activityId": world.activity._id,
               "extra": date}

    world.browser.put(world.picture.get_path() + "retry/",
                      json_encode(idsDict))
