Feature: Manage notes through handlers

    Scenario: Synchronize posts
        Given My contact is tagged with "friend"
        Given 3 posts are created on first newebe with tag "friend"
        And 2 posts are created on first newebe with tag "family"
        And 3 pictures are created on first newebe with tag "friend"
        And 2 pictures are created on first newebe with tag "family"
        And 3 files are created on first newebe with tag "friend"
        And 2 files are created on first newebe with tag "family"
        When I ask for synchronization
        And Wait for 3 seconds
        Then 3 posts from first newebe are stored in second newebe
        And 3 pictures from first newebe are stored in second newebe
        And 3 files from first newebe are stored in second newebe
        When I ask for synchronization
        And Wait for 3 seconds
        Then 3 posts from first newebe are stored in second newebe
        And 3 pictures from first newebe are stored in second newebe
        And 3 files from first newebe are stored in second newebe

    Scenario: Synchronize profiles
        Modify first newebe profile directly to DB
        When I ask for synchronization
        Wait for 3 seconds
        Check that profile saved on second newebe is the one set on first one

