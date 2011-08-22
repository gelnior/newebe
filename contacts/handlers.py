from newebe.core.handlers import NewebeAuthHandler

# Template handlers for contact pages.

class ContactTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/contact.html")


