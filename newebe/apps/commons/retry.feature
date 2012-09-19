Feature: Retrieve, post and delete microposts

   Scenario: Retry sending last common
        Given Add three commons to the database with different dates
        And add one activity for first common with one error for my contact
        When I send a retry request
        And From second Newebe, retrieve commons
        Then I have a common and an activity for it
        And first activity has no more errors

    Scenario: Retry deleting last common      
        Given Post a new common via the dedicated resource 
        And I add one deletion activity for first common with one error 
        When I send a delete retry request
        And From second Newebe, retrieve commons
        Then Check that there are no common
        And first activity has no more errors
        


