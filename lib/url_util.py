import urlparse


def extract_host_and_port(url):
    '''
    Extract port and hostname from a Newebe URL
    '''
    result = urlparse.urlparse(url)

    if result.port is None:
        return (result.hostname, 80)
    else:
        return (result.hostname, result.port)
