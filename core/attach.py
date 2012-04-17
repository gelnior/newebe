from newebe.notes.models import NoteManager

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
        for doc in data.get("attachments", []):
            note = NoteManager.get_note(doc["id"])
            docs.append(note.toDictForAttachment())
        return docs
