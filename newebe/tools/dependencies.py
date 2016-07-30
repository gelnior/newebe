import os
import socket


def is_exe(fpath):
    return os.path.isfile(fpath) and os.access(fpath, os.X_OK)


def which(program):
    fpath, fname = os.path.split(program)
    if fpath:
        if is_exe(program):
            return program
    else:
        for path in os.environ["PATH"].split(os.pathsep):
            exe_file = os.path.join(path, program)
            if is_exe(exe_file):
                return exe_file

    return None


def check_PIL():
    try:
        import PIL
    except ImportError:
        print "Newebe needs python-imaging."


def check_CouchDB():
    test_socket = socket.socket()
    try:
        test_socket.connect(("127.0.0.1", 5984))
    except socket.error:
        print "Newebe needs CouchDB, but nothing is listening on 5984"


def check_OpenSSL():
    if not which("openssl"):
        print "Newebe needs openssl."


def check_all_dependencies():
    check_PIL()
    #check_CouchDB()
    #check_OpenSSL()
