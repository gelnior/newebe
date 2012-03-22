from newebe.contacts import handlers as contacts
from newebe.profile import handlers as profile
from newebe.auth import handlers as auth
from newebe.news import handlers as news
from newebe.activities import handlers as activities
from newebe.notes import handlers as notes
from newebe.pictures import handlers as pictures
from newebe.sync import handlers as sync

from newebe.settings import DEBUG

routes = [
    ('/', news.NewsTHandler),
    ('/login/', auth.LoginHandler),
    ('/login/json/', auth.LoginJsonHandler),
    ('/logout/', auth.LogoutHandler),
    ('/register/', auth.RegisterTHandler),
    ('/register/password/', auth.RegisterPasswordTHandler),
    ('/register/password/content/', auth.RegisterPasswordContentTHandler),
    ('/user/password/', auth.UserPasswordHandler),
            
    ('/user/$', profile.UserHandler),
    ('/profile/$', profile.ProfileTHandler),
    ('/profile/content/$', profile.ProfileContentTHandler),
    ('/profile/menu-content/$', profile.ProfileMenuContentTHandler),
    ('/profile/tutorial/1/$', profile.ProfileTutorial1THandler),
    ('/profile/tutorial/2/$', profile.ProfileTutorial2THandler),

    ('/contacts/$', contacts.ContactsHandler),
    ('/contacts/update-profile/$', contacts.ContactUpdateHandler),
    ('/contacts/pending/$', contacts.ContactsPendingHandler),
    ('/contacts/requested/$', contacts.ContactsRequestedHandler),
    ('/contacts/trusted/$', contacts.ContactsTrustedHandler),
    ('/contacts/confirm/$', contacts.ContactConfirmHandler),
    ('/contacts/request/$', contacts.ContactPushHandler),
    ('/contacts/render/([0-9A-Za-z-]+)/$', contacts.ContactRenderTHandler),
    ('/contacts/([0-9A-Za-z-]+)/$', contacts.ContactHandler),
    ('/contacts/([0-9A-Za-z-]+)/retry/$', contacts.ContactRetryHandler),
    ('/contact/$', contacts.ContactTHandler),
    ('/contact/content/$', contacts.ContactContentTHandler),
    ('/contact/tutorial/1/$', contacts.ContactTutorial1THandler),
    ('/contact/tutorial/2/$', contacts.ContactTutorial2THandler),

    ('/news/', news.NewsTHandler),
    ('/news/microposts/', news.NewsHandler),
    ('/news/microposts/mine/([0-9\-]+)/', news.MyNewsHandler),
    ('/news/microposts/mine/', news.MyNewsHandler),
    ('/news/microposts/all/([0-9\-]+)/', news.NewsHandler),
    ('/news/microposts/all/', news.NewsHandler),
    ('/news/microposts/contacts/', news.NewsContactHandler),
    ('/news/micropost/([0-9a-z]+)/', news.MicropostHandler),
    ('/news/micropost/([0-9a-z]+)/html/', news.MicropostTHandler),
    ('/news/micropost/([0-9a-z]+)/retry/', news.NewsRetryHandler),
    ('/news/content/', news.NewsContentTHandler),
    ('/news/tutorial/1/', news.NewsTutorial1THandler),
    ('/news/tutorial/2/', news.NewsTutorial2THandler),
    ('/news/suscribe/', news.NewsSuscribeHandler),
 
    ('/activities/', activities.ActivityPageHandler),
    ('/activities/content/', activities.ActivityContentHandler),
    ('/activities/all/', activities.ActivityHandler),
    ('/activities/all/([0-9\-]+)/', activities.ActivityHandler),
    ('/activities/mine/', activities.MyActivityHandler),
    ('/activities/mine/([0-9\-]+)/', activities.MyActivityHandler),

    ('/notes/', notes.NotesPageTHandler),
    ('/notes/content/', notes.NotesContentTHandler),
    ('/notes/all/', notes.NotesHandler),
    ('/notes/all/order-by-title/', notes.NotesHandler),
    ('/notes/all/order-by-date/', notes.NotesByDateHandler),
    ('/notes/([0-9a-z]+)/', notes.NoteHandler),
    ('/notes/([0-9a-z]+)/html/', notes.NoteTHandler),

    ('/synchronize/', sync.SynchronizeHandler),
    ('/synchronize/contact/', sync.SynchronizeContactHandler),

    ('/pictures/$', pictures.PicturesTHandler),
    ('/pictures/tests/$', pictures.PicturesTestsTHandler),
    ('/pictures/content/$', pictures.PicturesContentTHandler),            
    ('/pictures/last/$', pictures.PicturesHandler),
    ('/pictures/last/([0-9\-]+)/$', pictures.PicturesHandler),
    ('/pictures/last/my/$', pictures.PicturesMyHandler),        
    ('/pictures/last/my/([0-9\-]+)/$', pictures.PicturesMyHandler),
    ('/pictures/fileuploader/$', pictures.PicturesQQHandler),
    ('/pictures/contact/$', pictures.PictureContactHandler),
    ('/pictures/contact/download/$', pictures.PictureContactDownloadHandler),
    ('/pictures/([0-9a-z]+)/$', pictures.PictureHandler),
    ('/pictures/([0-9a-z]+)/render/$', pictures.PictureTHandler),            
    ('/pictures/([0-9a-z]+)/retry/$', pictures.PictureRetryHandler),
    ('/pictures/([0-9a-z]+)/download/$', pictures.PictureDownloadHandler),
    ('/pictures/([0-9a-z]+)/(.+)', pictures.PictureFileHandler),            
]

if DEBUG:
    routes.extend([
        ('/pictures/tests/', pictures.PicturesTestsTHandler)
    ])

