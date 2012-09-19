Feature: Date conversion tools

    Scenario: Convert db date to url date
        Assert that 2011-02-01-12-45-32 is converted to 2011-02-01T12:45:32Z 

    Scenario: Convert db date to date
        Assert that 2011-02-01T12:45:32Z is well converted to date

    Scenario: Convert date to db date
        Assert that date is well converted to 2011-02-01T12:45:32Z

    Scenario: Convert url date to date
        When I convert 2011-02-01-12-45-32 to date
        I get date corresponding to 2011-02-01T12:45:32Z 
        
    Scenario: Convert utc date to timezone date
        When I convert 2011-02-01T12:45:32Z to timezone date
        I get date corresponding to 2011-02-01T13:45:32Z

    Scenario: Convert timezone date to utc date
        When I convert 2011-02-01T13:45:32Z to utc date
        I get date corresponding to 2011-02-01T12:45:32Z

    Scenario: Convert timezone date to utc date
        When I convert 2011-02-01T13:45:32Z to utc date
        I get date corresponding to 2011-02-01T12:45:32Z

    Scenario: Convert timezone date to utc date
        When I convert url date 2011-02-01-13-45-32 to utc date
        I get date corresponding to 2011-02-01T12:45:32Z

