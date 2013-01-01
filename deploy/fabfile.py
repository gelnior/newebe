from fabric.api import sudo, cd, task, prompt
from fabric.contrib import files
from fabtools import require, python, supervisor

# Variables
newebe_dir = "/home/newebe/newebe"
newebe_process = newebe_user = "newebe"
newebe_user_dir = "/home/newebe/"
python_exe = newebe_dir + "/virtualenv/bin/python"
newebe_exe = "newebe_server.py"

# Helpers
import random
import string
 
def random_string(n):
    """Create n length random string"""

    chars = string.letters + string.digits
    code = ''.join([random.choice(chars) for i in range(n)])
    return code

def newebedo(cmd):
    """Run a commande as a newebe user"""

    sudo(cmd, user=newebe_user)

def delete_if_exists(filename):
    """Delete given file if it already exists"""

    if files.exists(filename):
        newebedo("rm -rf %s" % filename)

# Install tasks

@task()
def setup():
    """Deploy the whole newebe stack"""

    install_deb_packages()
    create_user()
    install_newebe()
    make_dirs()
    build_configuration_file()
    build_certificates()
    setup_supervisord()
    set_supervisord_config()

@task()
def install_deb_packages():
    """Install required deb packages"""

    require.deb.packages([
        'python',
        'python-dev',
        'build-essential',
        'python-setuptools',
        'python-pip',
        'python-pycurl',
        'python-imaging',
        'couchdb',
        'git',
        'libxml2-dev',
        'libxslt-dev',
        'openssl'
    ])
    #sudo("apt-get build-dep python-imaging")

@task()
def create_user():
    """Create newebe user"""

    require.user(newebe_user, newebe_user_dir)

@task()
def install_newebe():
    """Install Newebe as a main software"""

    update_source()
    
@task()
def make_dirs():
    """Make dir required for a proper install"""

    with cd(newebe_user_dir):
        delete_if_exists('newebe')
        newebedo("mkdir newebe")
        newebedo("mkdir newebe/certs")

@task()
def build_configuration_file():
    """Build default configuration file """

    timezone = prompt("""
Which time zone do you want for your database (default is Europe/Paris,
Check Newebe wiki for timezone list) ? 
\n \n
""")
    if not timezone:
        timezone = "Europe/Paris"

    with cd(newebe_dir):
        delete_if_exists('local_settings.py')
        newebedo('echo "main:" >> config.yaml')
        newebedo('echo "    port: 8000" >> config.yaml')
        newebedo('echo "    debug: False" >> config.yaml')
        newebedo("echo '    timezone: \"%s\"' >> config.yaml" % timezone)
        newebedo('echo "db:" >> config.yaml')
        newebedo("echo '    name: \"newebe\"' >> config.yaml")
        newebedo('echo "security:" >> config.yaml')
        newebedo("echo '    cookie_key: \"%s\"' >> config.yaml" % \
                 random_string(42))

@task()
def build_certificates():
    """Build HTTPS certificates"""

    with cd(newebe_dir + "/certs"):
        delete_if_exists('server.key')
        delete_if_exists('server.crt')
        newebedo("openssl genrsa -out ./server.key 1024")
        newebedo("openssl req -new -x509 -days 3650 -key ./server.key -out\
                  ./server.crt -batch")
    
@task()
def setup_supervisord():
    """Install python daemon manager, supervisord"""

    python.install("meld3==0.6.9", use_sudo=True)
    require.deb.package("supervisor")

@task()
def set_supervisord_config():
    """Configure Newebe runner for supervisord"""

    require.supervisor.process(newebe_process,
        command='%s --configfile=%s' % 
            (newebe_exe, newebe_dir + "/config.yaml"),
        user=newebe_user
    )
    supervisor.start_process(newebe_process)

# Update tasks

@task()
def update():
    """Update source code, build require couchdb views then restart newebe"""

    update_source()
    restart_newebe()
    
@task()
def update_source():
    """Simple git pull inside newebe directory"""

    python.install("git+git://github.com/gelnior/newebe.git")

@task()
def restart_newebe():
    """Restart newebe surpervisord process"""

    supervisor.restart_process(newebe_process)
