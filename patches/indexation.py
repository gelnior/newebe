import sys

sys.path.append("../")
from newebe.news.models import MicroPostManager
from newebe.lib.date_util import get_db_date_from_date
from newebe.lib.indexer import Indexer

indexer = Indexer()

print "indexation starts...."

# Fill index with posts from DB
posts = MicroPostManager.get_list()
while len(posts) > 9:

    print "indexing %d" % len(posts)
    if len(posts) > 0:
        lastPost = list(posts)[-1]
    indexer.index_microposts(posts)
        
    if lastPost:
        date = get_db_date_from_date(lastPost.date)
        print date
        posts = MicroPostManager.get_list(startKey=date)
    else:
        posts = []

    
print "indexation finished"
