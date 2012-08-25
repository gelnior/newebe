import os
import sys

from whoosh.fields import Schema, ID, KEYWORD, TEXT
from whoosh import index
from whoosh.query import Term, And

schema = Schema(content=TEXT, docType=TEXT, docId=ID(stored=True), tags=KEYWORD)

class Indexer():
    """
    Indexer simplifies objects indexation and search with the whoosh api.
    """

    def __init__(self):
        """
        Set index, create it if it does not exists.
        """
        if not os.path.exists("indexes"):
            os.mkdir("indexes")
            self.index = index.create_in("indexes", schema)
        else:
            self.index = index.open_dir("indexes")
        
        self.writer = self.index.writer()


    def index_microposts(self, microposts):
        """
        Add given microposts to index, tag and content are stored.
        """

        for post in microposts:
            self.writer.update_document(content=post.content,
                                        docType=u"micropost",
                                        docId=unicode(post._id),
                                        tags=post.tags)
        self.writer.commit()

    def index_micropost(self, micropost):
        """
        Add given micropost to index, tag and content are stored.
        """

        self.writer.update_document(content=micropost.content,
                                    docType=u"micropost",
                                    docId=unicode(micropost._id),
                                    tags=micropost.tags)
        self.writer.commit()


    def search_microposts(self, word):
        """
        Return a list of microposts that contains given word.
        """

        with self.index.searcher() as searcher:
            results = searcher.search(
                And([Term("content", word), Term("docType", u"micropost")]))
            return [result["docId"] for result in results]

