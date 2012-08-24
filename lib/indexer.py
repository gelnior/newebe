import os
import sys

from whoosh.fields import Schema, ID, KEYWORD, TEXT
from whoosh import index
from whoosh.query import Term, And

schema = Schema(content=TEXT, docType=TEXT, docId=ID(stored=True), tags=KEYWORD)

class Indexer():

    def __init__(self):
        if not os.path.exists("indexes"):
            os.mkdir("indexes")
            self.index = index.create_in("indexes", schema)
        else:
            self.index = index.open_dir("indexes")
        
        self.writer = self.index.writer()

    def index_microposts(self, microposts):
        for post in microposts:
            self.writer.update_document(content=post.content,
                                        docType=u"micropost",
                                        docId=unicode(post._id),
                                        tags=post.tags)
        self.writer.commit()

    def index_micropost(self, micropost):
        self.writer.update_document(content=micropost.content,
                                    docType=u"micropost",
                                    docId=unicode(micropost._id),
                                    tags=micropost.tags)
        self.writer.commit()

    def search_microposts(self, word):
        with self.index.searcher() as searcher:
            results = searcher.search(
                And([Term("content", word), Term("docType", u"micropost")]))
            return [result["docId"] for result in results]

