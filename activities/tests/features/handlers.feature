Feature: Retrieve Activities


    Scenario: Retrieve last activities from handler
        Clear all activities from database
        Retrieve last activities
        Assert that there is 0 activities retrieved.
        Creates 35 activities - 10 for owner, at 2010-09-01T11:05:12Z 
        Get last activities from handler
        Assert that there are, from handler, 30 activities retrieved

    Scenario: Retrieve last activities of newebe owner
        Clear all activities from database
        Retrieve last activities of owner
        Assert that there is 0 activities retrieved.
        Creates 35 activities - 10 for owner, at 2010-09-01T11:05:12Z 
        Get last activities of owner from handler
        Assert that there are, from handler, 10 activities retrieved

    Scenario: Retrieve activities from a date
        Clear all activities from database
        Creates 15 activities - 10 for owner, at 2010-09-01T11:05:12Z        
        Creates 15 activities - 10 for owner, at 2010-08-01T11:05:12Z
        Get activities until 2010-08-15-11-05-12 from handler
        Assert that there are, from handler, 15 activities retrieved

    Scenario: Retrieve owner activities from a date
        Clear all activities from database
        Creates 15 activities - 10 for owner, at 2010-09-01T11:05:12Z        
        Creates 15 activities - 10 for owner, at 2010-08-01T11:05:12Z
        Get owner activities until 2010-08-15-11-05-12 from handler
        Assert that there are, from handler, 10 activities retrieved

    Scenario: Test timezone conversion through handlers
        Clear all activities from database
        Creates one activity 
        Get last activities from handler
        Then My activity date is converted to my timezone
        
