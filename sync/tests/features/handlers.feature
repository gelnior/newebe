Feature: Manage notes through handlers

    Scenario: Synchronize posts
        Given 5 posts are created on first newebe
        And 5 pictures are created on first newebe
        When I ask for synchronization
        And Wait for 3 seconds
        Then 5 posts from first newebe are stored in second newebe
        And 5 pictures from first newebe are stored in second newebe

    Scenario: Synchronize profiles
        Modify first newebe profile directly to DB
        When I ask for synchronization
        Wait for 3 seconds
        Check that profile saved on second newebe is the one set on first one

