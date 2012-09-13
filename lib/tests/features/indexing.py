# -*- coding: utf-8 -*-

import shutil
import os

from lettuce import step, before, world
from nose.tools import assert_equals

from newebe.lib.test_util import reset_documents
from newebe.news.models import MicroPost, MicroPostManager
from newebe.profile.models import UserManager

from newebe.lib.indexer import Indexer
from newebe.lib.test_util import NewebeClient

@before.all
def create_default_user():
    client = NewebeClient()
    client.set_default_user()

@before.each_scenario
def delete_posts(scenario):
    reset_documents(MicroPost, MicroPostManager.get_list)

@before.each_scenario
def delete_indexes(scenario):
    if os.path.exists("indexes"):
        shutil.rmtree("indexes")

def createMicropost(content):
    micropost = MicroPost()
    micropost.author = UserManager.getUser().name
    micropost.authorKey = UserManager.getUser().key
    micropost.content = content
    micropost.isMine = True
    micropost.save()
    return micropost

@step(u'Given I create five microposts with tags and text')
def given_i_create_five_microposts_with_tags_and_text(step):
    world.microposts = []
    world.microposts.append(
        createMicropost("This a long story about knights"))
    world.microposts.append(
        createMicropost("They battle for faeries and queens"))
    world.microposts.append(
        createMicropost("But they don't know about karetaka or ninjutsu"))
    world.microposts.append(
        createMicropost("But this is useless versus dragon and witches"))
    world.microposts.append(
        createMicropost("Hopefully they are master of vim that could impress \
            anyone"))


@step(u'And I index them')
def and_i_index_them(step):
    world.indexer = Indexer()
    world.indexer.index_microposts(world.microposts)

@step(u'When I ask for search "([^"]*)"')
def when_i_ask_for_search_group1(step, word):
    world.ids = world.indexer.search_microposts(unicode(word))

@step(u'Then I got it returns me micropost the micropost about "([^"]*)"')
def then_i_got_it_returns_me_micropost_the_micropost_about_group1(step, group1):
    assert_equals(len(world.ids), 1)
    assert_equals(world.ids[0], world.microposts[3]._id)

@step(u'Given I create three microposts with links')
def given_i_create_three_microposts_with_links(step):
    world.microposts = []
    world.microposts.append(
            createMicropost("This a long story about knights. \
                http://www.twitter.com/"))
    world.microposts.append(
            createMicropost("They battle for faeries and queens\
                http://www.facebook.com"))
    world.microposts.append(
        createMicropost("But they don't http://www.google.fr/ \
                        know about karetaka or ninjutsu"))

@step(u'Then It returns the micropost about with twitter link')
def then_it_returns_the_micropost_about_with_google_link(step):
    assert_equals(len(world.ids), 1)
    assert_equals(world.ids[0], world.microposts[0]._id)

@step(u'And I remove from index the micropost about "([^"]*)"')
def and_i_remove_from_index_the_micropost_about_group1(step, group1):
    world.indexer.remove_doc(world.microposts[3])
    
@step(u'Then there is no micropost returned')
def then_there_is_no_micropost_returned(step):
    assert_equals(len(world.ids), 0)

