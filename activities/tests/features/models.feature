Feature: Retrieve Activities

    Scenario: Retrieve a given activity
        Take the default activity
        Save current activity
        Get activity with default activity id
        Assert that current activity is the same as retrieved activity

    Scenario: Add an error to an activity
        Take the default activity
        Take the default contact
        Add an error for this contact to the activity
        Assert that activity error infos are the same as contact info.

    Scenario: Retrieve last activities
        Clear all activities from database
        Retrieve last activities
        Assert that there is 0 activities retrieved.
        Creates 35 activities - 10 for owner, at 2010-09-01T11:05:12Z 
        Retrieve last activities
        Assert that there is 30 activities retrieved.

    Scenario: Retrieve last activities of newebe owner
        Clear all activities from database
        Retrieve last activities of owner
        Assert that there is 0 activities retrieved.
        Creates 35 activities - 10 for owner, at 2010-09-01T11:05:12Z 
        Retrieve owner last activities
        Assert that there is 10 activities retrieved.

    Scenario: Retrieve activities from a date
        Clear all activities from database
        Creates 15 activities - 10 for owner, at 2010-09-01T11:05:12Z        
        Creates 15 activities - 10 for owner, at 2010-08-01T11:05:12Z
        Retrieve activities from 2010-08-15T11:05:12Z
        Assert that there is 15 activities retrieved.

    Scenario: Retrieve owner activities from a date
        Clear all activities from database
        Creates 15 activities - 10 for owner, at 2010-09-01T11:05:12Z        
        Creates 15 activities - 10 for owner, at 2010-08-01T11:05:12Z
        Retrieve owner activities from 2010-08-15T11:05:12Z
        Assert that there is 10 activities retrieved.

