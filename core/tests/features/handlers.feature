Feature: Handlers returning basic response


    Scenario: Return JSON
        When I send a request to Json resource
        Then I got a response with JSON inside

    Scenario: Return document
        When I send a request to document resource
        Then I got the user in response

    Scenario: Return documents
        When I send a request to documents resource
        Then I got two times the user in response

    Scenario: Return success
        When I send a request to success resource
        Then I got a json with a success text 

    Scenario: Return failure
        When I send a request to failure resource
        Then I got a json with a failure text 

    Scenario: Test dates
        
