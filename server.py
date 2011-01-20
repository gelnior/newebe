import sys

from twisted.application import internet, service
from twisted.web import server, static

STATIC_PORT = 8000
INTERFACE = "localhost"

# Add newebe path to environment.
sys.path.append("../")

#local imports
from newebe.server.twisted_wsgi import get_root_resource

# Twisted Application setup:
application = service.Application('hotdot')
serviceCollection = service.IServiceCollection(application)

# Django and static file server:
root_resource = get_root_resource()
root_resource.putChild("static", static.File("static"))
http_factory = server.Site(root_resource, logPath="http.log")
internet.TCPServer(STATIC_PORT, http_factory, interface=INTERFACE).setServiceParent(serviceCollection)

