Feature: Retrieve, post and delete microposts

    Scenario: Retry sending last post
        Given there are 1 posts of me and 0 posts of my contacts
        And one activity for first micropost with one error for my contact
        When I send a retry request
        And I send a request to second newebe to retrieve last posts
        Then I have a micropost and an activity for it
        And activity has no more errors

    Scenario: Retry deleting last post        
        Given I send a request to post a micropost
        And add one deletion activity for first micropost with one error 
        When I send a delete retry request
        And I send a request to second newebe to retrieve last posts
        Then I have 0 microposts
        And activity has no more errors
        


