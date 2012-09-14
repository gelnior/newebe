Feature: Test newebe document


    Scenario: Creation date properly set on first save
        Deletes current user
        Sets a new user
        Saves it
        Checks that is date is set
        Checks that tag list initialized 

    Scenario: Checks user convertion
        Gets Default User
        Converts it to dict
        Converts it to JSON

    Scenario: Document date is converted to timezone
        Gets Default user
        When I converts it to dict
        Then dict date field is the timezone date
