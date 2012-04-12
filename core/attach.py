from newebe.notes.models import NoteManager

class Converter():

    def convert(self, data):

        docs = []
        for doc in data.get("attachments", []):
            note = NoteManager.get_note(doc["id"])
            docs.append(note.toDictForAttachment())
        return docs
