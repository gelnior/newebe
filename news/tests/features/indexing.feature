Feature: Index and search microposts

    Scenario: Post micropost
        Given I created post through handlers with text "little stories begin"
        And I created post through handlers with text "great dragons are coming"
        And I created post through handlers with text "small hobbits are afraid"
        And I created post through handlers with text "such as humans"
        When I send a request to search the posts containing "dragons"        
        Then this micropost is the second micropost I created
