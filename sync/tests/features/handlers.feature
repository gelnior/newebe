Feature: Manage notes through handlers

    Scenario: Synchronize posts
        Creates 5 posts on first newebe
        When I ask for synchronization
        Wait for 3 seconds
        Check that 5 posts from first newebe are stored in second newebe

    Scenario: Synchronize profiles
        Modify first newebe profile directly to DB
        When I ask for synchronization
        Wait for 3 seconds
        Check that profile saved on second newebe is the one set on first one

