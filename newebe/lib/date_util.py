import datetime
import pytz

from newebe.config import CONFIG

utc = pytz.utc
timezone = pytz.timezone(CONFIG.main.timezone)

DB_DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%SZ"
URL_DATETIME_FORMAT = "%Y-%m-%d-%H-%M-%S"
DISPLAY_DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"


def get_date_from_db_date(date):
    '''
    Convert string date at database format (%Y-%m-%d-%H-%M-%S) to date object.
    '''
    return datetime.datetime.strptime(date, DB_DATETIME_FORMAT)


def get_date_from_url_date(date):
    '''
    Convert sting date at url format to date object (%Y-%m-%d-%H-%M-%S)
    '''
    return datetime.datetime.strptime(date, URL_DATETIME_FORMAT)


def get_db_date_from_date(date):
    '''
    Convert date object to string date at database format (%Y-%m-%d-%H-%M-%S).
    '''
    return date.strftime(DB_DATETIME_FORMAT)


def get_db_date_from_url_date(urlDate):
    '''
    Convert date from url format to database format (%Y-%m-%d-%H-%M-%S to
    %Y-%m-%dT%H:%M:%SZ)

    Arguments :
        *urlDate*: The date to convert.
    '''
    date = datetime.datetime.strptime(urlDate, URL_DATETIME_FORMAT)
    return get_db_date_from_date(date)


def convert_utc_date_to_timezone(utc_date, tz=timezone):
    '''
    Convert UTC date to timezone set in newebe settings file
    '''
    return utc_date.replace(tzinfo=pytz.utc).astimezone(tz)


def convert_timezone_date_to_utc(date, tz=timezone):
    '''
    Convert timezone (set in newebe settings file) date to UTC date.
    '''
    date = tz.localize(date)
    return date.astimezone(pytz.utc)


def get_db_utc_date_from_url_date(urlDate, tz=timezone):
    '''
    3 steps convertion :
    * from url date to date object
    * from date to utc date
    * from utc date to db date
    '''
    date = get_date_from_url_date(urlDate)
    date = convert_timezone_date_to_utc(date, tz)
    return get_db_date_from_date(date)
