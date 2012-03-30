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

    ('/contacts/all/$', contacts.ContactsHandler),
    ('/contacts/update-profile/$', contacts.ContactUpdateHandler),
    ('/contacts/pending/$', contacts.ContactsPendingHandler),
    ('/contacts/requested/$', contacts.ContactsRequestedHandler),
    ('/contacts/trusted/$', contacts.ContactsTrustedHandler),
    ('/contacts/confirm/$', contacts.ContactConfirmHandler),
    ('/contacts/request/$', contacts.ContactPushHandler),
    ('/contacts/$', contacts.ContactTHandler),
    ('/contacts/content/$', contacts.ContactContentTHandler),
    ('/contacts/tutorial/1/$', contacts.ContactTutorial1THandler),
    ('/contacts/tutorial/2/$', contacts.ContactTutorial2THandler),
    ('/contacts/([0-9A-Za-z-]+)/$', contacts.ContactHandler),
    ('/contacts/([0-9A-Za-z-]+)/retry/$', contacts.ContactRetryHandler),
    ('/contacts/([0-9A-Za-z-]+)/html/$', contacts.ContactRenderTHandler),

    ('/activities/', activities.ActivityPageHandler),
    ('/activities/content/', activities.ActivityContentHandler),
    ('/activities/all/', activities.ActivityHandler),
    ('/activities/all/([0-9\-]+)/', activities.ActivityHandler),
    ('/activities/mine/', activities.MyActivityHandler),
    ('/activities/mine/([0-9\-]+)/', activities.MyActivityHandler),

    ('/synchronize/', sync.SynchronizeHandler),
    ('/synchronize/contact/', sync.SynchronizeContactHandler),

    ('/microposts/all/([0-9\-]+)/', news.NewsHandler),
    ('/microposts/all/', news.NewsHandler),
    ('/microposts/mine/([0-9\-]+)/', news.MyNewsHandler),
    ('/microposts/mine/', news.MyNewsHandler),
    ('/microposts/contacts/', news.NewsContactHandler),
    ('/microposts/suscribe/', news.NewsSuscribeHandler),
    ('/microposts/([0-9a-z]+)/', news.MicropostHandler),
    ('/microposts/([0-9a-z]+)/html/', news.MicropostTHandler),
    ('/microposts/([0-9a-z]+)/retry/', news.NewsRetryHandler),
    ('/microposts/', news.NewsTHandler),
    ('/microposts/content/', news.NewsContentTHandler),
    ('/microposts/tutorial/1/', news.NewsTutorial1THandler),
    ('/microposts/tutorial/2/', news.NewsTutorial2THandler),
    ('/microposts/suscribe/', news.NewsSuscribeHandler),
 
    ('/notes/all/', notes.NotesHandler),
    ('/notes/all/html/', notes.NoteRowsTHandler),
    ('/notes/all/order-by-title/', notes.NotesHandler),
    ('/notes/all/order-by-date/', notes.NotesByDateHandler),
    ('/notes/', notes.NotesPageTHandler),
    ('/notes/content/', notes.NotesContentTHandler),
    ('/notes/([0-9a-z]+)/', notes.NoteHandler),
    ('/notes/([0-9a-z]+)/html/', notes.NoteTHandler),
      
    ('/pictures/all/$', pictures.PicturesHandler),
    ('/pictures/all/([0-9\-]+)/$', pictures.PicturesHandler),
    ('/pictures/mine/$', pictures.PicturesMyHandler),        
    ('/pictures/mine/([0-9\-]+)/$', pictures.PicturesMyHandler),
    ('/pictures/fileuploader/$', pictures.PicturesQQHandler),
    ('/pictures/contact/$', pictures.PictureContactHandler),
    ('/pictures/contact/download/$', pictures.PictureContactDownloadHandler),
    ('/pictures/content/$', pictures.PicturesContentTHandler),   
    ('/pictures/tests/$', pictures.PicturesTestsTHandler),
    ('/pictures/([0-9a-z]+)/$', pictures.PictureHandler),
    ('/pictures/([0-9a-z]+)/html/$', pictures.PictureTHandler),            
    ('/pictures/([0-9a-z]+)/retry/$', pictures.PictureRetryHandler),
    ('/pictures/([0-9a-z]+)/download/$', pictures.PictureDownloadHandler),
    ('/pictures/([0-9a-z]+)/(.+)', pictures.PictureFileHandler),  
    ('/pictures/$', pictures.PicturesTHandler),
]

if DEBUG:
    routes.extend([
        ('/pictures/tests/', pictures.PicturesTestsTHandler)
    ])

