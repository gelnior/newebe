from newebe.apps.notes.models import NoteManager
from newebe.apps.pictures.models import PictureManager


class Converter():
    '''
    Convert data send by user as attachment to real data to send to newebe
    contacts.
    '''

    def convert(self, data):
        '''
        Expect to have an attachments field in given dict. When dict has some
        attachments, it retrieves corresponding docs and convert them in
        attachment dict (same as usual dict with less fields).
        Then attach docs are returned inside an array.
        '''

        docs = []
        self.fileDocs = []
        for doc in data.get("attachments", []):
            if doc["type"] == "Note":
                note = NoteManager.get_note(doc["id"])
                docs.append(note.toDictForAttachment())
            elif doc["type"] == "Picture":
                picture = PictureManager.get_picture(doc["id"])
                docs.append(picture.toDictForAttachment())
                self.fileDocs.append(picture)

        return docs

    def add_files(self, mainDoc):
        '''
        Attaches files linked to attached documents to the main document.

        Call this method only after convertion of attachments has been done
        on mainDoc.
        '''

        for doc in self.fileDocs:
            pic_file = doc.fetch_attachment("prev_" + doc.path)
            mainDoc.put_attachment(pic_file, doc.path)
