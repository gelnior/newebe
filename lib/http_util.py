import logging

from tornado.httpclient import AsyncHTTPClient, HTTPRequest
from upload_util import encode_multipart_formdata

logger = logging.getLogger(__name__)


class ContactClient(object):
    '''
    Async HTTP client to make facilitate request sending to newebe contacts.
    '''

    def __init__(self, activity):
        '''
        Register activity in which errors will be stored if a request to a
        contact failed.
        '''
        
        self.contacts = dict()
        self.client = AsyncHTTPClient()
        self.activity = activity


    def get(self, contact, path):
        '''
        Perform a GET request to given contact.
        '''

        url = contact.url + path
        request = HTTPRequest(url)
        return self.client.fetch(self, request)


    def post(self, contact, path, body):
        '''
        Perform a POST request to given contact.
        '''

        url = contact.url + path
        request = HTTPRequest(url, method="POST", body=body)
        self.contacts[request] = contact
        return self.client.fetch(request, self.on_contact_response)


    def post_files(self, contact, path, fields={}, files={}):
        '''
        Post file and fields to givent contact.
        '''

        (contentType, body) = encode_multipart_formdata(fields=fields, 
                                                        files=files)
        headers = { 'Content-Type': contentType } 

        url = contact.url + path
        request = HTTPRequest(url=url, method="POST", 
                              body=body, headers=headers)
        self.contacts[request] = contact
        return self.client.fetch(request, self.on_contact_response)


    def delete(self, contact, path, body):
        '''
        Perform a DELETE request to given contact (PUT is send because tornado
        does not handle DELETE request with body).
        '''

        url = contact.url + path
        request = HTTPRequest(url, method="PUT", body=body)
        self.contacts[request] = contact
        return self.client.fetch(request, self.on_contact_response)


    def on_contact_response(self, response, **kwargs):
        '''
        Callback for requests sent to contacts. If error occurs it 
        marks it inside the activity for which error occurs. Else 
        it logs that micropost posting succeeds.
        '''

        if response.error: 
            logger.error(""" Request to a contact failed, error infos 
                             are stored inside activity.""")            
            contact = self.contacts[response.request]
            self.activity.add_error(contact)
            self.activity.save()

        else: 
            logger.info("Post successfully sent.")
        
        del self.contacts[response.request]


