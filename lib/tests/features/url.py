# -*- coding: utf-8 -*-
from lettuce import step, world

from newebe.lib import url_util

@step(u'When I extract data from url "(.*)"')
def when_i_extract_data_from_url_group1(step, url):
    world.host, world.port = url_util.extract_host_and_port(url)

@step(u'Then I have "(.*)" and (\d+) as results')
def then_i_have_group1_and_8000_as_results(step, host, port):
    assert world.host == host
    assert world.port == int(port)

