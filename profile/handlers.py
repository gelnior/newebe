from newebe.core.handlers import NewebeAuthHandler

# Template handlers.

class ProfileTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/profile.html")

class ProfileMenuContentTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/profile_menu_content.html")

