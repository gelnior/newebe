Feature: Retrieve Posts

    Scenario: Retrieve last posts
        Given there are 3 posts of me and 3 posts of my contacts
        When I retrieve the last posts
        Then I have 6 posts ordered by date
        When I retrieve my last posts
        Then I have 3 posts ordered by date


    Scenario: Retrieve given post
        Given there are 3 posts of me and 3 posts of my contacts
        When I retrieve a post for a given date
        Then I have 1 post corresponding to given date
        When I retrieve a post for a given ID
        Then I have 1 post corresponding to given ID
        When I retrieve a post for a given contact and a given date
        Then I have 1 post corresponding to given contact and date


