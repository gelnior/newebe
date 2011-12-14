Feature: Rertrieve pictures

    Scenario: Get pictures
        Clear all pictures
        And Add three pictures to the database with different dates
        When I Get last pictures
        I have three pictures ordered by date
        When I get first from its id
        I have one picture corresponding to id
        When I get first from its date and author
        I have one picture corresponding to id
        When I Get my last pictures
        I have two pictures ordered by date


