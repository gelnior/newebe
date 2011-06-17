Feature: Retrieve Activities

    #    Scenario: Retrieve last activity
    #    Get the default activity
    #    Then I retrieve the last activity
    #    My activity and last activity have same fields
    #    I delete the activity


    Scenario: Add an error to an activity
        Take the default activity
        Take the default contact
        Add an error for this contact to the activity
        Assert that activity error infos are the same as contact info.
