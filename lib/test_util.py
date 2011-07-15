from lettuce import world
from tornado.escape import json_decode
from tornado.httpclient import HTTPClient

from newebe.settings import TORNADO_PORT

client = HTTPClient()
ROOT_URL = "http://localhost:%d/" % TORNADO_PORT

def fetch_documents_from_url(url):
    '''
    Retrieve newebe documents from a givent url
    '''
    response = client.fetch(url)

    assert response.code == 200
    assert response.headers["Content-Type"] == "application/json"
 
    world.data = json_decode(response.body)
    return world.data["rows"]

def fetch_documents(path):
    fetch_documents_from_url(ROOT_URL + path)
