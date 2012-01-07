Feature: Retrieve, post and delete microposts

    Scenario: Retry sending last picture
        Given Add three pictures to the database with different dates
        And one activity for first picture with one error for my contact
        When I send a retry request
        And From second Newebe, retrieve pictures
        Then I have a picture and an activity for it
        And first activity has no more errors

    Scenario: Retry deleting last picture      
        Given Post a new picture via the dedicated resource 
        And I add one deletion activity for first picture with one error 
        When I send a delete retry request
        And From second Newebe, retrieve pictures
        Then Check that there are no picture
        And activity has no more errors
        


