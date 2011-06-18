Feature: Date conversion tools

    Scenario: Convert db date to url date
        Assert that 2011-02-01-12-45-32 is converted to 2011-02-01T12:45:32Z 

    Scenario: Convert db date to date
        Assert that 2011-02-01T12:45:32Z is well converted to date
        
