from newebe.core.handlers import NewebeAuthHandler

# Template handlers.
class ProfileTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/profile.html")


