from fabric.api import sudo, cd, task, settings
from fabtools import require, python, supervisor

newebe_dir = "/home/newebe/newebe"
newebe_process = newebe_user = "newebe"
newebe_user_dir = "/home/newebe/"

def newebedo(cmd):
    sudo(cmd, user=newebe_user)

@task
def setup(timezone="Europe/Paris"):
    install_deb_packages()
    create_user()
    get_source()
    install_python_dependencies()
    sync_db()
    build_configuration_file(timezone)
    set_supervisord_config()

def install_deb_packages():
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

def create_user():
    require.user(newebe_user, newebe_user_dir)

def get_source():
    with cd(newebe_user_dir):
        newebedo("git clone git://github.com/gelnior/newebe.git")

def install_python_dependencies():
    require.python.virtualenv(newebe_dir + "/virtualenv",
                              use_sudo=True, user=newebe_user)
    with python.virtualenv(newebe_dir + "/virtualenv"):
        newebedo("pip install --use-mirrors -r %s/deploy/requirements.txt" % \
                 newebe_dir)

@task
def sync_db():
    with python.virtualenv(newebe_dir + "/virtualenv"), cd(newebe_dir):
        newebedo("python syncdb.py")
        
def build_configuration_file(timezone="Europe/Paris"):
    with cd(newebe_dir):
        newebedo('echo "TIMEZONE = \"%s\"" >> local_settings.py' % timezone)
        cmd = 'echo "COOKIE_KEY = \"`< /dev/urandom tr -dc A-Za-z0-9_ | head'
        cmd += ' -c50`\"" >> local_settings.py'
        newebedo(cmd)

@task
def set_supervisord_config():
    require.deb.package("python-meld3")
    python.install("meld3==0.6.7", use_sudo=True)
    python_exe = newebe_dir + "/virtualenv/bin/python"
    require.supervisor.process(newebe_process,
        command='%s /home/newebe/newebe/newebe_server.py' % python_exe,
        directory=newebe_dir,
        user=newebe_user
    )
    supervisor.restart_process(newebe_process)


@task
def update():
    update_source()
    sync_db()
    restart_newebe()
    
def update_source():
    with cd(newebe_dir):
        newebedo("git pull")

@task
def restart_newebe():
    supervisor.start_process(newebe_process)
    
