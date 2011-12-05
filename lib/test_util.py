import hashlib

from lettuce import world
from tornado.escape import json_decode
from tornado.httpclient import HTTPClient, HTTPRequest

from newebe.settings import TORNADO_PORT
from newebe.profile.models import UserManager, User

ROOT_URL = "http://localhost:%d/" % TORNADO_PORT


class NewebeClient(HTTPClient):
    '''
    Tornado client wrapper to write requests to Newebe faster.
    '''


    def login(self, password):
        '''
        Grab authentication cookie from login request.
        '''

        response = self.fetch(self.root_url + "login/json/", 
                method="POST", body='{"password":"%s"}' % password)
        
        assert response.headers["Set-Cookie"].startswith("password=")
        self.cookie = response.headers["Set-Cookie"]


    def set_default_user(self, url=ROOT_URL):
        '''
        Set to DB default user. This is useful for automatic login.
        '''
        
        self.root_url = url

        user = UserManager.getUser()
        if user:
            user.delete()
        
        user = User(
            name = "John Doe",
            password = hashlib.sha224("password").hexdigest(),
            key = "key",
            authorKey = "authorKey",
            url = url,
            description = "my description"
        )
        user.save()


    def get(self, url):
        '''
        Perform a GET request.
        '''

        if hasattr(self, "root_url") and self.root_url:
            url = self.root_url + url

        request = HTTPRequest(url)
        if hasattr(self, "cookie") and self.cookie:
            request.headers["Cookie"] = self.cookie
        return HTTPClient.fetch(self, request)


    def post(self, url, body):
        '''
        Perform a POST request.
        '''

        if hasattr(self, "root_url") and self.root_url:
            url = self.root_url + url

        request = HTTPRequest(url, method="POST", body=body)
        if hasattr(self, "cookie") and self.cookie:
            request.headers["Cookie"] = self.cookie
        return HTTPClient.fetch(self, request)


    def put(self, url, body):
        '''
        Perform a PUT request.
        '''

        if hasattr(self, "root_url") and self.root_url:
            url = self.root_url + url

        request = HTTPRequest(url, method="PUT", body=body)
        if hasattr(self, "cookie") and self.cookie:
            request.headers["Cookie"] = self.cookie
            
        return HTTPClient.fetch(self, request)


    def delete(self, url):
        '''
        Perform a DELETE request.
        '''

        if hasattr(self, "root_url") and self.root_url:
            url = self.root_url + url

        request = HTTPRequest(url, method="DELETE")
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
 
        return json_decode(response.body)["rows"][0]


    def fetch_documents_from_url(self, url):
        '''
        Retrieve newebe document list from a givent url
        '''

        response = self.get(url)

        assert response.code == 200
        assert response.headers["Content-Type"] == "application/json"
 
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
        
