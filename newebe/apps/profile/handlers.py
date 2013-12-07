import logging

from threading import Timer

from tornado.httpclient import HTTPClient, HTTPRequest
from couchdbkit.exceptions import ResourceNotFound

from newebe.lib.picture import Resizer
from newebe.apps.core.handlers import NewebeAuthHandler
from newebe.apps.profile.models import UserManager
from newebe.apps.contacts.models import ContactManager

from newebe.apps.activities.models import Activity

logger = logging.getLogger("newebe.core")


class ProfileUpdater:
    '''
    Utility class to handle profile forwarding to contacts. Set error
    log inside acitivity when error occurs.
    '''

    sending_data = False
    contact_requests = {}

    def send_profile_to_contacts(self):
        '''
        External methods to not send too much times the changed profile.
        A timer is set to wait for other modifications before running this
        function that sends modification requests to every contacts.
        '''
        client = HTTPClient()
        self.sending_data = False

        user = UserManager.getUser()
        jsonbody = user.toJson()

        activity = Activity(
            authorKey=user.key,
            author=user.name,
            verb="modifies",
            docType="profile",
            method="PUT",
            docId="none",
            isMine=True
        )
        activity.save()

        for contact in ContactManager.getTrustedContacts():

            try:
                request = HTTPRequest(
                    "%scontacts/update-profile/" % contact.url,
                    method="PUT",
                    body=jsonbody,
                    validate_cert=False)
                response = client.fetch(request)

                if response.error:
                    logger.error("""
                        Profile sending to a contact failed, error infos are
                        stored inside activity.
                    """)
                    activity.add_error(contact)
                    activity.save()
            except:
                logger.error("""
                    Profile sending to a contact failed, error infos are
                    stored inside activity.
                """)
                activity.add_error(contact)
                activity.save()

            logger.info("Profile update sent to all contacts.")

    def forward_profile(self):
        '''
        Because profile modification occurs a lot in a short time. The
        profile is forwarded only every two minutes. It avoids to create
        too much activities for this profile modification.
        '''
        t = Timer(1.0 * 60, self.send_profile_to_contacts)
        if not self.sending_data:
            self.sending_data = True
            t.start()


profile_updater = ProfileUpdater()


class UserHandler(NewebeAuthHandler):
    '''
    This resource allows :
     * GET : retrieve current user (newebe owner) data.
     * POST : create a new user (if user exists, error response is returned).
     * PUT : modify current user data. Send profile to every contacts
     after a pre-defined time.
    '''

    def get(self):
        '''
        Retrieves current user (newebe owner) data at JSON format.
        '''
        user = UserManager.getUser()
        self.return_json(user.toDict())

    def put(self):
        '''
        Modifies current user data with sent data (user object at JSON format).
        Then forwards it to contacts after a pre-defined time.
        '''
        user = UserManager.getUser()

        data = self.get_body_as_dict(
                expectedFields=["name", "url", "description"])

        if data:
            user.name = data["name"]
            user.url = data["url"]
            user.description = data["description"]
            user.save()

            profile_updater.forward_profile()

            self.return_success("User successfully Modified.")
        else:
            self.return_failure("Wrong data were sent.")


class ProfilePictureHandler(NewebeAuthHandler):
    '''
    Handler use to change and retrieve profile picture.
    '''

    def get(self):
        '''
        Returns current profile picture as a jpeg file.
        '''
        try:
            user = UserManager.getUser()
            file = user.fetch_attachment("picture.jpg")
            self.return_file("picture.jpg", file)
        except ResourceNotFound:
            self.return_failure("Picture not found.", 404)


    def post(self):
        '''
        Change current profile picture, resize it before that.
        '''
        (filebody, filename, filetype) = self.get_qq_file_infos()
        resizer = Resizer()
        picture = resizer.resize_and_get_file(filebody, 400, 400)
        small_picture = resizer.resize_and_get_file(filebody, 100, 100)

        user = UserManager.getUser()
        user.put_attachment(content=picture, name="picture.jpg")
        user.put_attachment(content=small_picture, name="small_picture.jpg")
        user.picture_content_type = filetype
        user.save()
        self.return_success("File uploaded")

        self.send_files_to_contacts(
            "contact/update-profile/picture/",
            fields={"key": user.key},
            files=[("small_picture", "small_picture.jpg", small_picture)]
        )



