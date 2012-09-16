Feature: Share commons

    Scenario: Post a common
        Clear all commons
        From seconde Newebe, clear all commons
        Post a new common via the dedicated resource     
        Retrieve last commons
        Download first returned common
        Ensure it is the same that posted common
        Ensure that common date is ok with time zone
        Retrieve last activities
        Check that last activity correspond to a common creation
        From second Newebe, retrieve commons
        Check that date common on second newebe is the same
        Check that common name is the posted common.
        From second Newebe, posted common download fails
        From second Newebe, request for download
        From second Newebe, download the first returned common
        Ensure it is the same that posted common
        From second Newebe, retrieve activities
        Check that last activity correspond to a common creation


    Scenario: Delete common
        Clear all commons
        From seconde Newebe, clear all commons        
        Post a new common via the dedicated resource
        Retrieve last commons
        Through handler delete first common
        Retrieve last commons
        Check that there are no common
        From second Newebe, retrieve commons
        Check that there are no common
        Retrieve last activities
        Check that last activity correspond to a common deletion
        From second Newebe, retrieve activities
        Check that last activity correspond to a common deletion

    Scenario: Retrieve commons
        Clear all commons
        Add three commons to the database with different dates
        Retrieve all commons through handlers
        Check that there is three commons with the most recent one as first common
        Retrieve all commons before november 2, through handlers
        Check that there is two commons with the most recent one as first common

    Scenario: Retrieve common
        Clear all commons
        Add three commons to the database with different dates
        Retrieve all commons through handlers
        Retrieve first common hrough handler via its ID.
        Check that common title is the same that first common
    
    Scenario: Retrieve My commons
        Clear all commons
        Add three commons to the database with different dates
        Retrieve all commons through my commons handlers
        Check that there is two commons with the most recent one as first common
        Retrieve all owner commons before november 1, through handlers
        Check that there is one common


