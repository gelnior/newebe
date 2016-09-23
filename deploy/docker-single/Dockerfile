FROM python:2

MAINTAINER Gelnior <gelnior@free.fr>

# Python and build dependencies
RUN apt-get update && apt-get install -y \
    python-setuptools \
    python-pycurl \
    python-imaging \
    build-essential\
    git \
    libxml2-dev \
    libxslt-dev

# Install newebe
RUN pip install image
RUN pip install git+git://github.com/gelnior/newebe.git

# Create folders
RUN mkdir -p /usr/local/etc/newebe/
RUN mkdir -p /usr/local/var/newebe/
RUN mkdir -p /usr/local/var/log/newebe/

EXPOSE 8282
CMD ["newebe_server.py", "--configfile=/usr/local/etc/newebe/config.yaml"]

