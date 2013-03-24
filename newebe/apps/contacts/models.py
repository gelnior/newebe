import logging

from couchdbkit.schema import Document, StringProperty, DateTimeProperty

from newebe.apps.core.models import NewebeDocument
from newebe.lib import date_util

logger = logging.getLogger("newebe.contacts")


# Contacts available states
STATE_PENDING = "Pending"
STATE_WAIT_APPROVAL = "Wait for approval"
STATE_ERROR = "Error"
STATE_TRUSTED = "Trusted"


class ContactManager():
    '''
    Methods to easily retrieve contacts from database.
    '''

    @staticmethod
    def getContacts():
        '''
        Returns whole contact list.
        '''

        contacts = Contact.view("core/contact")

        return contacts

    @staticmethod
    def getPendingContacts():
        '''
        Returns contacts of which state is equal to *pending* or *error*.
        '''

        contacts = Contact.view("core/pending")

        return contacts

    @staticmethod
    def getRequestedContacts():
        '''
        Returns contacts of which state is equal to *requested*.
        '''

        contacts = Contact.view("core/requested")

        return contacts

    @staticmethod
    def getTrustedContacts(tag=None):
        '''
        Returns contacts of which state is equal to *trusted*.
        '''

        if tag:
            contacts = Contact.view("core/contacttags", key=tag)
        else:
            contacts = Contact.view("core/trusted")

        return contacts

    @staticmethod
    def getTrustedContact(key):
        '''
        Returns trusted contact corresponding to *key*.
        '''

        contacts = Contact.view("core/trusted", key=key)

        contact = None
        if contacts:
            contact = contacts.first()

        return contact

    @staticmethod
    def getContact(slug):
        '''
        Returns contact corresponding to slug.
        '''

        contacts = Contact.view("core/contact", key=slug)

        contact = None
        if contacts:
            contact = contacts.first()

        return contact

    @staticmethod
    def getTags():
        '''
        Return the list of all tags that has been set on contacts.
        '''

        return [result for result in Contact.view("core/contacttags")]

    @staticmethod
    def getTag(id):
        tags = Contact.view("core/contacttags", key=id)

        tag = None
        if tags:
            tag = tags.first()

        return tag

class ContactTag(NewebeDocument):
    name = StringProperty()

    def toDict(self, localized=True):
        return { "name": self.name, "_id": self._id }

class Contact(NewebeDocument):
    '''
    Contact describes another newebe with which you are going to share thing
    (a "friend").
    '''

    name = StringProperty()
    key = StringProperty()
    url = StringProperty(required=True)
    state = StringProperty(required=True, default=STATE_PENDING)
    slug = StringProperty(required=True)
    requestDate = DateTimeProperty()
    description = StringProperty()

    def toDict(self, localized=True):
        '''
        Return a dict representation of the document (copy).

        Removes _rev key and convert date field and request date field
        to local timezone if *localized* is set to True.
        '''

        docDict = NewebeDocument.toDict(self, localized)

        if localized and docDict.get("requestDate", ""):

            utc_date = date_util.get_date_from_db_date(
                            docDict.get("requestDate"))
            date = date_util.convert_utc_date_to_timezone(utc_date)
            docDict["requestDate"] = date_util.get_db_date_from_date(date)

        return docDict
