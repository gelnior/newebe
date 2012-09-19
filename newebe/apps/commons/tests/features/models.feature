Feature: Rertrieve commons

    Scenario: Get commons
        Clear all commons
        And Add three commons to the database with different dates
        When I Get last commons
        I have three commons ordered by date
        When I get first from its id
        I have one common corresponding to id
        When I get first from its date and author
        I have one common corresponding to id
        When I Get my last commons
        I have two commons ordered by date
        When I Get commons until november 2
        I have two commons ordered by date        
        When I Get owner commons until november 1
        I have one common


