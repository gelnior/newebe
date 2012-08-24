# -*- coding: utf-8 -*-

import shutil
import os

from lettuce import step, before, world
from nose.tools import assert_equals

from newebe.lib.test_util import reset_documents
from newebe.news.models import MicroPost, MicroPostManager
from newebe.profile.models import UserManager

from newebe.lib.indexer import Indexer

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

