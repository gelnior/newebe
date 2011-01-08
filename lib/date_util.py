import datetime

DB_DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%SZ"
URL_DATETIME_FORMAT = "%Y-%m-%d-%H-%M-%S"
DISPLAY_DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"

def getDbDateFromUrlDate(urlDate):
    ''' 
    Convert date from url format to database format (%Y-%m-%d-%H-%M-%S to 
    %Y-%m-%dT%H:%M:%SZ)

    Arguments :
        *urlDate*: The date to convert.
    '''
    date = datetime.datetime.strptime(urlDate, URL_DATETIME_FORMAT)
    return date.strftime(DB_DATETIME_FORMAT)

def getDateFromDbDate(date):
    '''
    Convert string date at database format (%Y-%m-%d-%H-%M-%S) to date object 
    '''
    return datetime.datetime.strptime(date, DB_DATETIME_FORMAT)
