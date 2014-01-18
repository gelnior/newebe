FROM shykes/couchdb

MAINTAINER Gelnior <gelnior@free.fr>

# Python and build dependencies
RUN apt-get install -y python python-setuptools python-pip python-pycurl 
RUN apt-get install -y python-dev python-imaging build-essential git
RUN apt-get install -y libxml2-dev libxslt-dev supervisor

# Install newebe
RUN pip install git+git://github.com/gelnior/newebe.git

# Configure use
RUN groupadd newebe
RUN adduser --system --home /usr/local/var/newebe --ingroup newebe --gecos "Newebe system user" --shell /bin/false --quiet --disabled-password newebe 

# Create folders
RUN mkdir -p /usr/local/etc/newebe/
RUN mkdir -p /usr/local/var/newebe/
RUN mkdir -p /usr/local/var/log/newebe/
RUN chown newebe:newebe /usr/local/etc/newebe/
RUN chown newebe:newebe /usr/local/var/log/newebe/
RUN chown newebe:newebe /usr/local/var/newebe/

# Set config
ADD config.yaml /usr/local/etc/newebe/
ADD supervisor.conf /etc/supervisor/

# Configure supervisor to daemonize the process.
ADD couchdb.conf /etc/supervisor/conf.d/
ADD newebe.conf /etc/supervisor/conf.d/

EXPOSE 8282
CMD ["/usr/bin/supervisord", "-n"]
