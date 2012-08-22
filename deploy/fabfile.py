from fabric.api import sudo, cd, task, prompt, run
from fabric.contrib import files
from fabtools import require, python, supervisor

# Variables
newebe_dir = "/home/newebe/newebe"
newebe_process = newebe_user = "newebe"
newebe_user_dir = "/home/newebe/"
python_exe = newebe_dir + "/virtualenv/bin/python"
newebe_exe = newebe_dir + "/newebe_server.py"

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
    get_source()
    install_python_dependencies()
    sync_db()
    build_configuration_file()
    build_certificates()
    setup_supervisord()
    set_supervisord_config()

@task()
def install_deb_packages():
    """Install required deb packages"""

    require.deb.packages([
        'python',
        'python-setuptools',
        'python-pip',
        'python-pycurl',
        'python-imaging',
        'couchdb',
        'git',
        'openssl'
    ])

@task()
def create_user():
    """Create newebe user"""

    require.user(newebe_user, newebe_user_dir)

@task()
def get_source():
    """Get source from master branch of official git repo"""

    with cd(newebe_user_dir):
        delete_if_exists("newebe")
        newebedo("git clone git://github.com/gelnior/newebe.git")

@task()
def install_python_dependencies():
    """Install Python dependencies."""

    require.python.virtualenv(newebe_dir + "/virtualenv",
                              use_sudo=True, user=newebe_user)
    with python.virtualenv(newebe_dir + "/virtualenv"):
        newebedo("pip install --use-mirrors -r %s/deploy/requirements.txt" % \
                 newebe_dir)

@task()
def sync_db():
    """Build required Couchdb views"""

    with python.virtualenv(newebe_dir + "/virtualenv"), cd(newebe_dir):
        newebedo("python syncdb.py")
        
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
        newebedo('echo "TORNADO_PORT = 8000" >> local_settings.py')
        newebedo('echo "DEBUG = False" >> local_settings.py')
        newebedo("echo 'COUCHDB_DB_NAME = \"newebe\"' >> local_settings.py")
        newebedo("echo 'TIMEZONE = \"%s\"' >> local_settings.py" % timezone)
        newebedo("echo 'COOKIE_KEY = \"%s\"' >> local_settings.py" % \
                 random_string(42))

@task()
def build_certificates():
    """Build HTTPS certificates"""

    with cd(newebe_dir):
        delete_if_exists('server.key')
        delete_if_exists('server.crt')
        newebedo("openssl genrsa -out ./server.key 1024")
        newebedo("openssl req -new -x509 -days 3650 -key ./server.key -out\
                  ./server.crt")
    
@task()
def setup_supervisord():
    """Install python daemon manager, supervisord"""

    require.deb.package("python-meld3")
    python.install("meld3==0.6.7", use_sudo=True)

@task()
def set_supervisord_config():
    """Configure Newebe runner for supervisord"""

    require.supervisor.process(newebe_process,
        command='%s %s' % (python_exe, newebe_exe),
        directory=newebe_dir,
        user=newebe_user
    )
    supervisor.restart_process(newebe_process)

# Update tasks

@task()
def update():
    """Update source code, build require couchdb views then restart newebe"""

    update_source()
    sync_db()
    restart_newebe()
    
@task()
def update_source():
    """Simple git pull inside newebe directory"""

    with cd(newebe_dir):
        newebedo("git pull")

@task()
def restart_newebe():
    """Restart newebe surpervisord process"""

    supervisor.restart_process(newebe_process)
    
