import hashlib

from nose.tools import assert_in
from lettuce import world
from couchdbkit import Server
from tornado.escape import json_decode
from tornado.httpclient import HTTPClient, HTTPRequest

from newebe.config import CONFIG
from newebe.settings import COUCHDB_DB_NAME
from newebe.apps.profile.models import UserManager, User

ROOT_URL = u"http://localhost:8888/"
SECOND_NEWEBE_ROOT_URL = u"http://localhost:8889/"

server = Server()
server2 = Server()
db = server.get_or_create_db(CONFIG.db.name)
db2 = server.get_or_create_db(CONFIG.db.name + "2")
print db2


def reset_documents(cls, get_func, database=db):
    '''
    Clear all documents corresponding to *cls*.
    '''

    cls._db = database
    docs = get_func()
    while docs:
        for doc in docs:
            doc.delete()
        docs = get_func()
    cls._db = db


class NewebeClient(HTTPClient):
    '''
    Tornado client wrapper to write requests to Newebe faster.
    '''

    def login(self, password):
        '''
        Grab authentication cookie from login request.
        '''

        response = self.post("login/json/",
                             body='{"password":"%s"}' % password)
        assert response.headers["Set-Cookie"].startswith("password=")
        self.cookie = response.headers["Set-Cookie"]

    def set_default_user(self, url=ROOT_URL):
        '''
        Set to DB default user. This is useful for automatic login.
        '''

        self.root_url = url

        self.user = UserManager.getUser()
        if self.user:
            self.user.delete()

        self.user = User(
            name="John Doe",
            password=hashlib.sha224("password").hexdigest(),
            key="key",
            authorKey="authorKey",
            url=url,
            description="my description"
        )
        self.user.save()

    def set_default_user_2(self, url=ROOT_URL):
        '''
        Set to DB default user. This is useful for automatic login.
        '''

        self.root_url = url
        User._db = db2

        self.user = UserManager.getUser()
        if self.user:
            self.user.delete()

        self.user = User(
            name="Dan Frazer",
            password=hashlib.sha224("password").hexdigest(),
            key="key2",
            authorKey="authorKey2",
            url=url,
            description="my description"
        )
        self.user.save()
        User._db = db

    def get(self, url):
        '''
        Perform a GET request.
        '''

        if hasattr(self, "root_url") and self.root_url:
            url = self.root_url + url

        request = HTTPRequest(url, validate_cert=False)
        if hasattr(self, "cookie") and self.cookie:
            request.headers["Cookie"] = self.cookie
        return HTTPClient.fetch(self, request)

    def post(self, url, body):
        '''
        Perform a POST request.
        '''

        if hasattr(self, "root_url") and self.root_url:
            url = self.root_url + url

        request = HTTPRequest(url,
                              method="POST",
                              body=body,
                              validate_cert=False)
        if hasattr(self, "cookie") and self.cookie:
            request.headers["Cookie"] = self.cookie
        return HTTPClient.fetch(self, request)

    def put(self, url, body):
        '''
        Perform a PUT request.
        '''

        if hasattr(self, "root_url") and self.root_url:
            url = self.root_url + url

        request = HTTPRequest(url,
                              method="PUT",
                              body=body,
                              validate_cert=False)
        if hasattr(self, "cookie") and self.cookie:
            request.headers["Cookie"] = self.cookie

        return HTTPClient.fetch(self, request)

    def delete(self, url):
        '''
        Perform a DELETE request.
        '''

        if hasattr(self, "root_url") and self.root_url:
            url = self.root_url + url

        request = HTTPRequest(url, method="DELETE", validate_cert=False)
        if self.cookie:
            request.headers["Cookie"] = self.cookie
        return HTTPClient.fetch(self, request)

    def fetch_document_from_url(self, url):
        '''
        Retrieve newebe document from a givent url
        '''

        response = self.get(url)

        assert response.code == 200
        assert response.headers["Content-Type"] == "application/json"

        return json_decode(response.body)

    def fetch_documents_from_url(self, url):
        '''
        Retrieve newebe document list from a givent url
        '''

        response = self.get(url)

        assert response.code == 200
        assert_in("application/json", response.headers["Content-Type"])

        world.data = json_decode(response.body)
        return world.data["rows"]

    def fetch_document(self, path):
        '''
        Retrieve document from path located on localhost server.
        '''

        return self.fetch_document_from_url(path)

    def fetch_documents(self, path):
        '''
        Retrieve document list from path located on localhost server.
        '''

        return self.fetch_documents_from_url(path)
