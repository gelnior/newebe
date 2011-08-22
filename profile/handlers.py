from newebe.core.handlers import NewebeAuthHandler

# Template handlers.

class ProfileContentTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/profile_content.html")

class ProfileMenuContentTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/profile_menu_content.html")

class ProfileTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/profile.html")

class ProfileTutorial1THandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/tutorial_1.html")

class ProfileTutorial2THandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/tutorial_2.html")


