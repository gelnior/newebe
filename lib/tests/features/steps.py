import sys
import os

from tornado.escape import json_decode
from lettuce import step, world

sys.path.append("../../../")
os.environ['DJANGO_SETTINGS_MODULE'] = 'newebe.settings'

from newebe.lib import date_util, json_util, slugify
from newebe.news.models import MicroPost

@step(u'Assert that ([0-9-]+) is converted to ([0-9A-Z-:]+)')
def assert_that_db_date_is_converted_to_url_date(step, url_date, db_date):

    assert db_date == date_util.get_db_date_from_url_date(url_date)

@step(u'Assert that ([0-9A-Z-:]+) is well converted to date')
def assert_that_db_date_is_well_converted_to_date(step, db_date):

    date = date_util.get_date_from_db_date(db_date)
    assert db_date == date.strftime(date_util.DB_DATETIME_FORMAT)

@step(u'Assert that date is well converted to ([0-9A-Z-:]+)')
def assert_that_date_is_well_converted_to_2011_02_01t12_45_32z(step, db_date):

    date = date_util.get_date_from_db_date(db_date)
    assert db_date == date.strftime(date_util.DB_DATETIME_FORMAT)

@step(u'When I convert ([0-9A-Z-]+) to date')
def when_i_convert_2011_02_01_12_45_32_to_date(step, url_date):
    world.date =  date_util.get_date_from_url_date(url_date)

@step(u'I get date corresponding to ([0-9A-Z-:]+)')
def i_get_date_corresponding_to_2011_02_01t12_45_32z(step, db_date):
    assert db_date == world.date.strftime(date_util.DB_DATETIME_FORMAT)

@step(u'When I convert ([0-9A-Z-:]+) to timezone date')
def when_i_convert_2011_02_01_12_45_32_to_timezone_date(step, db_date):
    date = date_util.get_date_from_db_date(db_date)
    world.date =  date_util.convert_utc_date_to_timezone(date)

@step(u'When I convert ([0-9A-Z-:]+) to utc date')
def when_i_convert_2011_02_01_13_45_32_to_utc_date(step, db_date):
    date = date_util.get_date_from_db_date(db_date)
    world.date =  date_util.convert_timezone_date_to_utc(date)

@step(u'When I convert url date ([0-9A-Z-]+) to utc date')
def when_i_convert_url_date_2011_02_01_13_45_32_to_utc_date(step, urlDate):
    world.date = date_util.get_db_utc_date_from_url_date(urlDate)
    world.date = date_util.get_date_from_db_date(world.date)


@step(u'Creates (\d+) microposts')
def creates_x_microposts(step, nb_docs):
    world.documents = []
    for i in range(int(nb_docs)):
        post = MicroPost(
            author = "me",
            content = "test_content_%d" % i
        )
        world.documents.append(post)

@step(u'Converts documents to JSON')
def converts_documents_to_json(step):
    world.documents_json = json_util.get_json_from_doc_list(world.documents)

@step(u'Checks that number of JSON documents is equal to (\d+)')
def checks_that_number_of_json_documents_is_equal_to_x(step, nb_docs):
    doc_wrapper = json_decode(world.documents_json)
    assert int(nb_docs) == doc_wrapper['total_rows'] 

@step(u'Checks that content of JSON documents are the same as given documents')
def checks_that_content_of_json_documents_are_the_same_as_given_documents(step):
    doc_wrapper = json_decode(world.documents_json)
    json_docs = doc_wrapper["rows"]
    for doc in world.documents:
        is_same_content = False
        for json_doc in json_docs:
            if doc.content == json_doc["content"]:
                is_same_content = True
        assert is_same_content

# Slugify

@step(u'Convert Jhon Doe')
def convert_jhon_doe(step):
    world.slug = slugify.slugify(u"Jhon Doe")

@step(u'Get jhon-doe')
def get_jhon_doe(step):
    assert "jhon-doe" == world.slug

@step(u'Convert http://www.test.net:13200/')
def convert_http_www_test_net_13200(step):
    world.slug = slugify.slugify(u"http://www.test.net:13200/")

@step(u'Get httpwwwtestnet13200')
def get_httpwwwtestnet13200(step):
    assert "httpwwwtestnet13200" == world.slug

