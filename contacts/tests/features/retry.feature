Feature: Managing contacts (need to start two newebs on ports 8000 and 8010)

    Scenario: Retry sending a contact a contact request
        Set default contact
        Set contact with state as ERROR
        Send a retry request for this contact
        Checks that contact state is PENDING
        Checks that second newebe has first newebe in contact

