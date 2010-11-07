from django.utils import simplejson as json

def getJsonFromDocList(docs):
    response_dict = {}
    response_dict['total_rows'] = len(docs)

    docsDictList = list()
    for doc in docs:
        docsDictList.append(doc.toDict())
    response_dict['rows'] = docsDictList

    return json.dumps(response_dict)
