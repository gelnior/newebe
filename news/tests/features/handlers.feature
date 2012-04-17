Feature: Retrieve, post and delete microposts

    Scenario: Retrieve last posts
        Given there are 3 posts of me and 3 posts of my contacts
        When I send a request to retrieve the last posts
        Then I have 6 microposts ordered by date
        When I send a request to retrieve my last posts
        Then I have 3 microposts ordered by date


    Scenario: Post micropost
        When I send a request to post a micropost
        And I send a request to retrieve the last posts        
        Then I have 1 micropost
        And this micropost has timezone date
        When I send a request to second newebe to retrieve last posts    
        Then I have 1 micropost
        And this micropost has US/Eastern timezone'
        When I send a request to second newebe to retrieve owner last posts    
        Then I have 0 micropost


    Scenario: Delete micropost
        When I send a request to post a micropost
        And I send a request to retrieve the last posts
        And I send a delete request for this micropost
        And I send a request to retrieve the last posts 
        Then I have 0 micropost
        When I send a request to second newebe to retrieve last posts    
        Then I have 0 micropost


    Scenario: Attach Note
        When I send a new micropost with an attachment
        And I send a request to retrieve the last posts
        Then I have 1 micropost 
        And my note is attached to it
        When I send a request to second newebe to retrieve last posts    
        Then I have 1 micropost 
        And my note is attached to it

