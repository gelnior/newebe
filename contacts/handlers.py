from newebe.core.handlers import NewebeAuthHandler


class ContactTHandler(NewebeAuthHandler):
    def get(self):
        self.render("templates/contact.html")


