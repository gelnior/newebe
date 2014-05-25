import mimetools
import mimetypes
import logging

from tornado.httpclient import HTTPRequest

logger = logging.getLogger(__name__)


def get_picture_upload_request(url, picture):
    '''
    Construct a POST request from a picture and its thumbnail.
    '''

    fields = {"json": str(picture.toJson(localized=False))}
    files = [("picture", str(picture.path),
                picture.fetch_attachment("th_" + picture.path))]
    (contentType, body) = encode_multipart_formdata(fields=fields,
                                                    files=files)
    headers = {'Content-Type': contentType}

    return HTTPRequest(url=url, method="POST",
                          body=body, headers=headers)


def encode_multipart_formdata(fields, files,
            BOUNDARY='-----' + mimetools.choose_boundary() + '-----'):
    """ Encodes fields and files for uploading.
    fields is a sequence of (name, value) elements for regular form fields
    - or a dictionary.
    files is a sequence of (name, filename, value) elements for data to be
    uploaded as files.
    Return (content_type, body) ready for urllib2.Request instance
    You can optionally pass in a boundary string to use or we'll let
    mimetools provide one.
    """

    CRLF = '\r\n'
    L = []

    if isinstance(fields, dict):
        fields = fields.items()

    # Add fields
    for (key, value) in fields:
        L.append('--' + BOUNDARY)
        L.append('Content-Disposition: form-data; name="%s"' % key)
        L.append('')
        L.append(value)

    # Fill body with file data
    for (key, filename, value) in files:
        filetype = mimetypes.guess_type(filename)[0] or \
            'application/octet-stream'
        L.append('--' + BOUNDARY)
        L.append('Content-Disposition: form-data; name="%s"; filename="%s"'
                 % (key, filename))
        L.append('Content-Type: %s' % filetype)
        L.append('')
        L.append(unicode(value, errors='ignore'))

    L.append('--' + BOUNDARY + '--')
    L.append('')

    content_type = 'multipart/form-data; boundary=%s' % BOUNDARY
    body = CRLF.join(L)
    return content_type, body
