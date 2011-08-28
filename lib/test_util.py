from lettuce import world
from tornado.escape import json_decode
from tornado.httpclient import HTTPClient

from newebe.settings import TORNADO_PORT

ROOT_URL = "http://localhost:%d/" % TORNADO_PORT

class NewebeClient(HTTPClient):
    '''
    Tornado client wrapper to write requests to Newebe faster.
    '''


    def get(self, url):
        '''
        Perform a GET request.
        '''

        return HTTPClient.fetch(self, url)


    def post(self, url, body):
        '''
        Perform a POST request.
        '''

        return HTTPClient.fetch(self, url, method="POST", body=body)


    def put(self, url, body):
        '''
        Perform a PUT request.
        '''

        return HTTPClient.fetch(self, url, method="PUT", body=body)


    def delete(self, url):
        '''
        Perform a DELETE request.
        '''

        return HTTPClient.fetch(self, url, method="DELETE")


    def fetch_documents_from_url(self, url):
        '''
        Retrieve newebe documents from a givent url
        '''

        response = self.get(url)

        assert response.code == 200
        assert response.headers["Content-Type"] == "application/json"
 
        world.data = json_decode(response.body)
        return world.data["rows"]


    def fetch_documents(self, path):
        '''
        Retrieve documents from path located on localhost server.
        '''

        return self.fetch_documents_from_url(ROOT_URL + path)    
        
