import hashlib

from tornado.escape import json_decode

from newebe.apps.profile.models import User, UserManager
from newebe.apps.contacts.handlers import NewebeHandler
from newebe.apps.core.handlers import NewebeAuthHandler


class LoginHandler(NewebeHandler):
    '''
    * GET:  displaying page for logging in.
    * POST: Get password via a form. Set a secure cookie if password is OK
    then redirects to root page.
    Else it redirects to login page.
    '''

    def get(self):
        '''
        Displaying page for logging in.
        '''

        user = UserManager.getUser()

        if user and user.password:
            password = self.get_secure_cookie("password")

            if not password or  \
               user.password != hashlib.sha224(password).hexdigest():
                self.render("../auth/templates/login.html",
                            isTheme=self.is_file_theme_exists())
            else:
                self.redirect("/")

        elif user and not user.password:
            self.redirect("/register/password/")

        elif not user:
            self.redirect("/register/")

    def post(self):
        '''
        Get password via a form. Set a secure cookie if password is OK
        then redirects to root page.
        Else it redirects to login page.
        '''

        password = self.get_argument("password")
        user = UserManager.getUser()

        if user and user.password == hashlib.sha224(password).hexdigest():
            self.set_secure_cookie("password", password)
            self.redirect("/")

        else:
            self.redirect("/login/")


class LoginJsonHandler(NewebeHandler):
    '''
    * POST: Get password via a json object.  Sets a secure cookie if password
    is OK. Else it returns an error response.
    '''

    def post(self):
        '''
        Get password via a json object.  Sets a secure cookie if password
        is OK. Else it returns an error response.
        '''
        data = self.get_body_as_dict(expectedFields=["password"])

        if data:
            password = data["password"]
            user = UserManager.getUser()

            if user \
               and user.password == hashlib.sha224(password).hexdigest():
                self.set_secure_cookie("password", password)
                self.return_success("You are now logged in.")

            else:
                self.return_failure("Wrong password.", 400)

        else:
            self.return_failure("Wrong password.", 400)


class LogoutHandler(NewebeHandler):
    '''
    GET : Removes secure cookie for password then redirects to login page.
    '''

    def get(self):
        '''
        Remove secure cookie for password then redirects to login page.
        '''

        self.clear_cookie("password")
        self.redirect("/login/")


class RegisterPasswordTHandler(NewebeHandler):
    '''
    Handler for handling user password registration.

    * GET: If user does not have password it displays password registration
           page.
    * POST: Sets given password as user password (after sha-224 encryption).
    '''

    def get(self):
        '''
        If user does not have password it returns password registration page.
        '''

        user = UserManager.getUser()
        if user and user.password:
            self.redirect("/")
        else:
            self.render("../auth/templates/password.html",
                        isTheme=self.is_file_theme_exists())

        self.render("../auth/templates/password.html",
                    isTheme=self.is_file_theme_exists())

    def post(self):
        '''
        Sets given password as user password (after sha-224 encryption).
        '''

        user = UserManager.getUser()

        if user is None:
            self.return_failure("User does not exist.")

        elif user.password is not None:
            self.return_failure("Password is already set.")

        else:
            data = self.get_body_as_dict(expectedFields=["password"])

            if data:
                postedPassword = data["password"]

                if postedPassword and len(postedPassword) > 3:
                    password = \
                        hashlib.sha224(postedPassword).hexdigest()
                    user.password = password
                    user.save()
                    self.set_secure_cookie("password", postedPassword)

                    self.return_json(user.toJson())

                else:
                    self.return_failure(
                        "Password is too short. User password is not set.",
                        400)

            else:
                self.return_failure(
                    "Data are not correct. User password is not set.",
                    400)


class RegisterTHandler(NewebeHandler):
    '''
    * GET: If no user exist, it redirects to register root page, else
    it returns register page.
    * POST: Creates a new user (if user exists, error response is returned)
    from sent data (user object at JSON format).
    '''

    def get(self):
        '''
        If no user exist, it redirects to register root page, else
        it returns register page.
        '''

        if UserManager.getUser():
            self.redirect("/")
        else:
            self.render("../auth/templates/register.html",
                        isTheme=self.is_file_theme_exists())

    def post(self):
        '''
        Create a new user (if user exists, error response is returned) from
        sent data (user object at JSON format).
        '''

        if UserManager.getUser():
            self.return_failure("User already exists.")

        else:
            data = self.get_body_as_dict(expectedFields=["name"])

            if data:
                user = User()
                user.name = data['name']
                user.save()
                user.key = user._id
                user.save()

                self.return_json(user.toJson(), 201)

            else:
                self.return_failure(
                    "Data are not correct. User has not been created.",
                    400)


class UserPasswordHandler(NewebeAuthHandler):
    '''
    Handler made to allow user to change password.
    '''

    def put(self):
        '''
        If user exists, it changes his password.
        '''

        user = UserManager.getUser()

        if user:

            data = self.get_body_as_dict(expectedFields=["password"])

            if data:
                postedPassword = data['password']

                if postedPassword and len(postedPassword) >= 3:
                    user.password =  \
                        hashlib.sha224(postedPassword).hexdigest()
                    user.save()
                    self.set_secure_cookie("password", user.password)

                else:
                    self.return_failure(
                        "Password must be at least 3 characters long.", 400)


# Template handlers

class RegisterPasswordContentTHandler(NewebeHandler):
    def get(self):
        self.render("templates/password_content.html")
