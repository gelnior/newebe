import sys
import time

from lettuce import step, world, before
from tornado.escape import json_decode

sys.path.append("../../../")

from newebe.notes.models import Note, NoteManager
from newebe.activities.models import ActivityManager
from newebe.lib.date_util import get_date_from_db_date
from newebe.lib.test_util import NewebeClient

from newebe.settings import TORNADO_PORT
ROOT_URL = "http://localhost:%d/" % TORNADO_PORT

client = NewebeClient()


@before.all
def connec_client():
    world.browser = client
    world.browser.set_default_user()
    world.browser.login("password")
   

@before.each_scenario
def delete_all_notes(scenario):
    notes = NoteManager.get_all()
    for note in notes:
        note.delete()

@step(u'Create a note')
def create_a_note(step):
    world.note = Note(
        author = "Owner",
        title = "test note",
        content = "test content",
    )
    
@step(u'Save the note')
def save_the_note(step):
    world.note.save()

@step(u'Checks that date is rightly set')
def checks_that_date_is_rightly_set(step):
    assert world.note.lastModified is not None 

@step(u'Retrieve the note with note key')
def retrieve_the_note_with_note_key(step):
    world.test_note = NoteManager.get_note(world.note._id)

@step(u'Checks that notes have same fields')
def checks_that_notes_have_same_fields(step):
    assert world.test_note is not None
    assert world.test_note.author == world.note.author
    assert world.test_note.title == world.note.title
    assert world.test_note.content == world.note.content
    assert world.test_note.lastModified == world.note.lastModified
    assert world.test_note.isMine == world.note.isMine

@step(u'Creates (\d+) notes')
def creates_x_notes(step, nb_notes):
    world.notes = []
    for i in range(int(nb_notes)):
        note = Note(
            author = "Owner %d" % i,
            title = "test note %d" % (int(nb_notes) - i),
            content = "test content %d" % i,
        )
        note.save()
        world.notes.append(note)


@step(u'Retrieve all notes')
def retrieve_all_notes(step):
    world.test_notes = NoteManager.get_all().all()

@step(u'Checks that the (\d+) notes are the created notes')
def checks_that_the_x_notes_are_the_created_notes(step, nb_notes):
    world.test_notes.reverse()
    for i in range(int(nb_notes)):
        if isinstance(world.test_notes[i], dict):
            assert world.test_notes[i]["_id"] == world.notes[i]._id
        else:
            assert world.test_notes[i]._id == world.notes[i]._id

@step(u'Creates at different times (\d+) notes')
def creates_at_different_times_x_notes(step, nb_notes):
    world.notes = []
    for i in range(int(nb_notes)):
        note = Note(
            author = "Owner %d" % i,
            title = "test note %d" % i,
            content = "test content %d" % i,
        )
        note.save()
        world.notes.append(note)
        time.sleep(2)

@step(u'Retrieve, sorted by date, all notes')
def retrieve_sorted_by_date_all_notes(step):    
    world.test_notes = NoteManager.get_all_sorted_by_date().all()

@step(u'Checks that notes are sorted by date')
def checks_that_notes_are_sorted_by_date(step):
    for i in range(len(world.notes)):
        if i > 0:
            if isinstance(world.test_notes[i], dict):
                assert get_date_from_db_date(world.test_notes[i - 1]["lastModified"]).time()  > \
                      get_date_from_db_date(world.test_notes[i]["lastModified"]).time(),  (world.test_notes[i - 1]["lastModified"]) + u" " + (world.test_notes[i]["lastModified"])
            else:
                assert world.test_notes[i - 1].lastModified.time() > \
                      world.test_notes[i].lastModified.time() 

@step(u'Retrieve, through handler, all notes')
def retrieve_through_handler_all_notes(step):
    world.test_notes = client.fetch_documents("notes/all/")

@step(u'Retrieve, sorted by date, through handler, all notes')
def retrieve_sorted_by_date_through_handler_all_notes(step):
    world.test_notes = client.fetch_documents("notes/all/order-by-date/")

@step(u'Retrieve, sorted by title, through handler, all notes')
def retrieve_sorted_by_title_through_handler_all_notes(step):
    world.test_notes = client.fetch_documents("notes/all/order-by-title/")

@step(u'Checks that notes are sorted by title')
def checks_that_notes_are_sorted_by_title(step):
    for i in range(len(world.notes)):
        if i > 0:
            assert world.test_notes[i - 1]["title"] <  \
                   world.test_notes[i]["title"]

@step(u'Retrieve, through handler, the note with note id')
def retrieve_through_handler_the_note_with_note_id(step):
    notes = client.fetch_documents("notes/" + world.note._id + "/")
    assert len(notes) == 1
    world.test_note = Note(
        author = notes[0]["author"],
        title = notes[0]["title"],
        content = notes[0]["content"],
        lastModified = get_date_from_db_date(notes[0]["lastModified"]),
        isMine = notes[0]["isMine"],
    )

@step(u'Modifiy the note')
def modifiy_the_note(step):
    world.note.content = "new content"

@step(u'Save, through handler, the note')
def save_through_handler_the_note(step):
    response = client.put("notes/" + world.note._id + "/", 
                          body=world.note.toJson())
    assert response.code == 200

@step(u'Create, through handler, a note')
def create_through_handler_a_note(step):
    world.note = Note(
        title = "test note creation",
        content = "test content creation",
    )
    response = client.post("notes/all/", body=world.note.toJson())
    noteDict = json_decode(response.body)
    world.note = Note(
        author = noteDict["author"],
        title = noteDict["title"],
        content = noteDict["content"],
        lastModified = get_date_from_db_date(noteDict["lastModified"]),
        isMine = noteDict["isMine"],
    )
    world.note._id = noteDict["_id"]

@step(u'Delete, through handler, the note')
def delete_through_handler_the_note(step):
    response = client.delete("notes/" + world.note._id + "/")
    assert response.code == 200

@step(u'Checks that note is deleted')
def checks_that_note_is_deleted(step):
    world.test_note = NoteManager.get_note(world.note._id)
    assert world.test_note is None

@step(u'Checks that creation activity was created')
def checks_that_creation_activity_was_created(step):
    activity = ActivityManager.get_mine().first()
    assert activity is not None
    assert activity.verb == "writes"
    assert activity.docType == "note"
    assert activity.isMine

@step(u'Checks that deletion activity was created')
def checks_that_deletion_activity_was_created(step):
    activity = ActivityManager.get_mine().first()
    assert activity is not None
    assert activity.verb == "deletes", activity.toDict()
    assert activity.docType == "note"
    assert activity.isMine

