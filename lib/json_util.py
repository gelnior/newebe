from django.utils import simplejson as json

def getJsonFromDocList(docs):
    '''
    Converts a whole list of db documents to their JSON format, assuming the
    fact that they have toDict() method to convert them as dict object for
    easy JSON serializing.

    It sets doc in a field called *rows* and put the number of return object
    in a field called *total_rows*.

    Arguments : 
        *docs* List of documents to convert.
    '''
    response_dict = {}
    response_dict['total_rows'] = len(docs)

    docsDictList = list()
    for doc in docs:
        docsDictList.append(doc.toDict())
    response_dict['rows'] = docsDictList

    return json.dumps(response_dict)
