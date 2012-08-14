import os
from setuptools import setup

# Utility function to read the README file.
# Used for the long_description.  It's nice, because now 1) we have a top level
# README file and 2) it's easier to type in the README file than to put a raw
# string in below ...
def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()

setup(
    name = "Newebe",
    version = "0.5.0",
    author = "Gelnior",
    author_email = "gelnior@addictedtotheweb.net",
    description = ("Distributed social network"),
    license = "AGPL v3",
    keywords = "social share distributed",
    url = "http://newebe.org/",
    packages=['newebe'],
    long_description=read('README'),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Framework :: Tornado", 
        "Topic :: Utilities",
        "Natural Language :: English",
        "License :: OSI Approved :: BSD License",
        "Operating System :: POSIX :: Linux"
    ],
)
