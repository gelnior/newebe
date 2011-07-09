import sys
import os

from tornado.escape import json_decode
from lettuce import step, world

sys.path.append("../../../")
os.environ['DJANGO_SETTINGS_MODULE'] = 'newebe.settings'

from newebe.lib import date_util, json_util
from newebe.news.models import MicroPost

@step(u'Assert that ([0-9-]+) is converted to ([0-9A-Z-:]+)')
def assert_that_db_date_is_converted_to_url_date(step, url_date, db_date):

    assert db_date == date_util.getDbDateFromUrlDate(url_date)

@step(u'Assert that ([0-9A-Z-:]+) is well converted to date')
def assert_that_db_date_is_well_converted_to_date(step, db_date):

    date = date_util.getDateFromDbDate(db_date)
    assert db_date == date.strftime(date_util.DB_DATETIME_FORMAT)

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
    world.documents_json = json_util.getJsonFromDocList(world.documents)

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

