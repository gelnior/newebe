import os
import re
import time
import logging


from tornado.httpclient import HTTPClient
from lxml import html

from whoosh.fields import Schema, ID, KEYWORD, TEXT
from whoosh import index
from whoosh.qparser import QueryParser
from whoosh.query import Variations

from whoosh.support.charset import accent_map
from whoosh.analysis import RegexTokenizer
from whoosh.analysis import CharsetFilter, LowercaseFilter, StopFilter
from newebe.lib.stopwords import stoplists

from newebe.config import CONFIG

logger = logging.getLogger("newebe.lib")

chfilter = CharsetFilter(accent_map)
stoplist = stoplists["en"].union(stoplists["fr"])
analyzer = RegexTokenizer() | LowercaseFilter() | \
           StopFilter(stoplist=stoplist) | chfilter
schema = Schema(content=TEXT(analyzer=analyzer),
                docType=TEXT,
                docId=ID(stored=True),
                tags=KEYWORD)


class Indexer():
    """
    Indexer simplifies objects indexation and search with the whoosh api.
    """

    def __init__(self):
        """
        Set index, create it if it does not exists.
        """

        if CONFIG.main.debug:
            dirpath, filename = \
                os.path.split(os.path.realpath(__file__))

            index_path = os.path.join(dirpath, "..", "indexes")
        else:
            index_path = os.path.join(CONFIG.main.path, "indexes")

        if not os.path.exists(index_path):
            os.mkdir(index_path)
            self.index = index.create_in(index_path, schema)
        else:
            self.index = index.open_dir(index_path)

    def index_microposts(self, microposts, checkUrl=True):
        """
        Add given microposts to index, tag and content are stored.
        """

        self.writer = self.index.writer()
        for post in microposts:

            text = post.content
            if checkUrl:
                urls = self._extract_urls(post.content)
                text = self._augment_micropost(post, urls)

            self.writer.update_document(content=text,
                                        docType=u"micropost",
                                        docId=unicode(post._id),
                                        tags=post.tags)
        self.writer.commit()

    def index_micropost(self, micropost, checkUrl=True):
        """
        Add given micropost to index, tag and content are stored.
        """

        text = micropost.content
        if checkUrl:
            urls = self._extract_urls(micropost.content)
            text = self._augment_micropost(micropost, urls)

        self.writer = self.index.writer()
        self.writer.update_document(content=text,
                                    docType=u"micropost",
                                    docId=unicode(micropost._id),
                                    tags=micropost.tags)
        self.writer.commit()

    def search_microposts(self, word):
        """
        Return a list of microposts that contains given word.
        """

        time.sleep(1)
        parser = QueryParser("content", schema=schema,
                             termclass=Variations)
        query = parser.parse(word)

        with self.index.searcher() as searcher:
            results = searcher.search(query)
            return [result["docId"] for result in results]

    def remove_doc(self, doc):
        """
        Remove given doc from index (doc of which docId is equal to id).
        """

        self.writer = self.index.writer()
        self.writer.delete_by_term("docId", unicode(doc._id))
        self.writer.commit()

    def _extract_urls(self, text):
        """
        Extract Urls from given text.
        """

        return re.findall("https?://[\da-z\.-]+\.[a-z\.]{2,6}/[/\w\.-]*/?",
                          text)

    def _augment_micropost(self, post, urls, checkUrl=True):
        '''
        Grab meta field from each url given in parameter. then add its content
        to given micropost (for indexation purpose).
        '''

        text = unicode(post.content)
        for url in urls:
            client = HTTPClient()
            try:
                response = client.fetch(url)
                doc = html.fromstring(response.body)

                title = doc.xpath('//head/title')
                doc.xpath('/html/head/meta[@name="description"]/@content')
                description = doc.xpath(
                    '/html/head/meta[@name="description"]/@content')

                if title:
                    text += " " + title[0].text_content()
                if description:
                    text += " " + description[0]
            except:
                logger.error("A problem occured while indexing micropost links")

        return text
