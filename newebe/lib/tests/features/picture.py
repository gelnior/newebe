# -*- coding: utf-8 -*-
from lettuce import step, world

from newebe.lib.picture import Resizer

@step(u'Given I have a test image')
def given_i_have_a_test_image(step):
    world.test_image = open("./newebe/apps/pictures/tests/test.jpg", "r")
    print world.test_image

@step(u'When I resize it to 300 x 300')
def when_i_resize_it_to_300_x_300(step):
    resizer = Resizer()
    world.resized_image = resizer.resize(world.test_image.read(), 300, 300)

@step(u'Then I have a 300 x 300 image')
def then_i_have_a_300_x_300_image(step):
    world.resized_image.size = (300, 300)
