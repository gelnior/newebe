Feature: Retrieve Notes

    Scenario: Set a note
        Create a note
        Save the note
        Checks that date is rightly set
        Retrieve the note with note key
        Checks that notes have same fields

    Scenario: Retrieve all notes
        Creates 5 notes
        Retrieve all notes
        Checks that the 5 notes are the created notes

    Scenario: Retrieve all notes sorted by date
        Creates at different times 5 notes
        Retrieve, sorted by date, all notes
        Checks that notes are sorted by date


