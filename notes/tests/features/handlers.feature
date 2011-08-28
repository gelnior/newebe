Feature: Manage notes through handlers

    Scenario: Get all notes
        Creates 5 notes
        Retrieve, through handler, all notes
        Checks that the 5 notes are the created notes

    Scenario: Get all notes sorted by date
        Creates at different times 5 notes
        Retrieve, sorted by date, through handler, all notes
        Checks that notes are sorted by date

    Scenario: Get all notes sorted by title
        Creates 5 notes
        Retrieve, sorted by title, through handler, all notes
        Checks that notes are sorted by title

    Scenario: Get a note
        Create a note
        Save the note
        Retrieve, through handler, the note with note id
        Checks that notes have same fields

    Scenario: Create a note
        Create, through handler, a note
        Retrieve, through handler, the note with note id
        Checks that notes have same fields
        Checks that creation activity was created

    Scenario: Modify a note
        Create a note
        Save the note
        Modifiy the note
        Save, through handler, the note
        Retrieve, through handler, the note with note id
        Checks that notes have same fields

    Scenario: Delete a note
        Create a note
        Save the note
        Delete, through handler, the note
        Checks that note is deleted
        Checks that deletion activity was created

        
