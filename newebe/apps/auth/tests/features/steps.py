import sys
import hashlib

from lettuce import step, world, before
from lxml import html

from tornado.httpclient import HTTPRequest, HTTPError
from tornado.escape import json_decode

sys.path.append("../")

from newebe.lib.test_util import NewebeClient
from newebe.apps.profile.models import User, UserManager

ROOT_URL = "http://localhost:8888/"


# Auth steps

@before.all
def set_browser():
    world.browser = NewebeClient()


@before.each_scenario
def clear_cookie(scenario):
    world.cookie = ""
    world.browser.cookie = ""


@step('Set default user')
def set_default_user(step):
    world.user = User(
        name="John Doe",
        password=hashlib.sha224("password").hexdigest(),
        key="key",
        authorKey="authorKey",
        url="url",
        description="my description"
    )
    world.user._id = "userid"


@step(u'Delete current user')
def delete_current_user(step):
    user = UserManager.getUser()
    world.browser = NewebeClient()
    while user:
        user.delete()
        user = UserManager.getUser()


@step(u'Save default user')
def save_default_user(step):
    world.user.key = None
    world.user.save()


@step(u'Open root url')
def open_root_url(step):
    request = HTTPRequest(ROOT_URL + 'user/state/')
    if world.cookie:
        request.headers["Cookie"] = world.cookie
    resp = world.browser.fetch(request)
    world.response = json_decode(resp.body)
    world.response_header = resp.headers


@step(u'Checks that response is 403')
def checks_that_response_is_403(step):
    assert not world.response["authenticated"]


@step(u'Send login request with (\w+) as password')
def send_login_request(step, password):
    try:
        world.response = world.browser.fetch(ROOT_URL + "login/json/",
                method="POST", body='{"password":"%s"}' % password,
                validate_cert=False)
        world.response_headers = world.response.headers
    except HTTPError:
        pass


@step(u'Checks that secure cookie is set')
def checks_that_secure_cookie_is_set(step):
    assert world.response.headers
    assert "Set-Cookie" in world.response.headers

    world.cookie = world.response.headers["Set-Cookie"]
    world.browser.cookie = world.cookie
    assert world.response.headers["Set-Cookie"].startswith("password=")


@step(u'Checks that response is root page')
def checks_that_response_is_root_page(step):
    assert world.response["authenticated"]


@step(u'Checks that secure cookie is not set')
def checks_that_secure_cookie_is_not_set(step):
    assert hasattr(world, 'response_headers') or hasattr(world, 'response')
    if hasattr(world, 'response_headers'):
        assert "Set-Cookie" not in world.response_headers
    else:
        assert "Set-Cookie" not in world.response.headers


@step(u'Send logout request')
def send_logout_request(step):
    request = HTTPRequest(ROOT_URL + "logout/", validate_cert=False)
    if world.cookie:
        request.headers["Cookie"] = world.cookie
    world.response = world.browser.fetch(request)
    if world.response.code == 200:
        world.cookie = ""
        world.browser.cookie = ""


@step(u'Send creation request for (\w+) as user name')
def send_creation_request(step, name):
    try:
        request = HTTPRequest(
            ROOT_URL + "register/",
            method="POST",
            body='{"name":"%s"}' % name,
            validate_cert=False
        )
        world.response = world.browser.fetch(request)
        assert world.response.code == 201
    except HTTPError:
        pass


@step(u'Checks that newebe owner is called (\w+)')
def checks_that_newebe_owner_is_called_jhon(step, name):
    user = UserManager.getUser()
    assert user.name == name
    assert user.key is not None


@step(u'Open password registration url')
def open_password_registration_url(step):
    request = HTTPRequest(ROOT_URL + "register/password/", validate_cert=False)
    world.response = world.browser.fetch(request)


@step(u'Checks that response is password registration page')
def checks_that_response_is_password_registration_page(step):
    world.dom = html.fromstring(world.response.body)
    title = world.dom.cssselect('title')[0]
    assert "Register" in title.text, world.response.body


@step(u'Send password creation request with password as password')
def send_password_creation_request_with_password_as_password(step):
    request = HTTPRequest(ROOT_URL + "register/password/",
                          method="POST", body='{"password":"%s"}' % "password",
                          validate_cert=False)
    world.response = world.browser.fetch(request)
    assert world.response.code == 200


@step(u'Change password with (\w+)')
def change_password_with_password2(step, password):
    world.browser.put(ROOT_URL + "user/password/",
                      '{"password":"' + password + '"}')


@step(u'Fail to change user password with ba')
def fail_to_change_user_password_with_ba(step):
    try:
        world.response = world.browser.put(ROOT_URL + "user/password/",
                             body='{"password":"%s"}' % "ba")
        assert False
    except HTTPError:
        assert True


@step(u'Fail to send password creation request with ba as password')
def send_password_creation_request_with_ba_as_password(step):
    try:
        request = HTTPRequest(
            ROOT_URL + "register/password/",
            method="POST",
            body='{"password":"%s"}' % "ba",
            validate_cert=False
        )

        world.response = world.browser.fetch(request)
        assert False
    except HTTPError:
        assert True
