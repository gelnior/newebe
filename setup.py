#!/usr/bin/env python
from setuptools import setup
from newebe.tools.dependencies import check_all_dependencies

setup(
    setup_requires=['d2to1'],
    d2to1=True
)

# Check for dependancies not installable through pip
check_all_dependencies()
