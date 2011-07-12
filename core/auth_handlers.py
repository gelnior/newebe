import hashlib

from django.utils import simplejson as json
from tornado.escape import json_decode

from newebe.core.models import User, UserManager
from newebe.core.handlers import NewebeHandler

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
                self.render("../templates/core/login.html")
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
        data = self.request.body

        if data:
            try:
                postedData = json_decode(data)
                password = postedData["password"]
                user = UserManager.getUser()
        
                if user \
                   and user.password == hashlib.sha224(password).hexdigest():
                    self.set_secure_cookie("password", password)
                    self.returnSuccess("You are now logged in.")

                else:
                    self.returnFailure("Wrong password.", 400)

            except json.JSONDecodeError:
                self.returnFailure("Wrong password.", 400)
            
        else:
            self.returnFailure("Wrong password.", 400)
        

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
    GET: Return does not have password it displayes password registration page.
    '''


    def get(self):
        '''
        If user does not have password it returns password registration page.
        '''

        user = UserManager.getUser()
        if user and user.password:
            self.redirect("/") 
        else:
            self.render("../templates/core/password.html")

        self.render("../templates/core/password.html")


    def post(self):
        '''
        Sets given password as user password (after sha-224 encryption).
        '''

        user = UserManager.getUser()

        if user is None:
            self.returnFailure("User does not exist.")

        if user.password is not None:
            self.returnFailure("Password is already set.")

        data = self.request.body

        if data:
            postedPassword = json_decode(data)
            password = hashlib.sha224(postedPassword['password']).hexdigest()
            user.password = password
            user.save()
            self.set_secure_cookie("password", password)

            self.returnJson(user.toJson())

        else:
            self.returnFailure(
                    "Data are not correct. User password is not set.", 400)


class RegisterTHandler(NewebeHandler):
    '''
    * GET: If no user exist, it redirects to register root page, else
    it returns register page.
    * POST: Creates a new user (if user exists, error response is returned) from
    sent data (user object at JSON format).
    '''


    def get(self):
        '''
        If no user exist, it redirects to register root page, else
        it returns register page.
        '''

        if UserManager.getUser():
           self.redirect("/") 
        else:
            self.render("../templates/core/register.html")


    def post(self):
        '''
        Create a new user (if user exists, error response is returned) from
        sent data (user object at JSON format).
        '''      

        if UserManager.getUser():
            self.returnFailure("User already exists.")

        data = self.request.body
        
        if data:
            postedUser = json_decode(data)
            user = User()
            user.name = postedUser['name']
            user.save()
            user.key = user._id
            user.save()

            self.returnJson(user.toJson(), 201)

        else:
            self.returnFailure(
                    "Data are not correct. User has not been created.", 400)


# Template handlers

class RegisterPasswordContentTHandler(NewebeHandler):
    def get(self):
        self.render("../templates/core/password_content.html")


