Feature: Share pictures

    Scenario: Post a picture
        Clear all pictures
        From seconde Newebe, clear all pictures
        Post a new picture via the dedicated resource     
        Retrieve last pictures
        Download first returned picture
        Ensure it is the same that posted picture
        Download thumbnail of first returned picture
        Check that thumbnail is the posted picture thumbnail
        Download preview of first returned picture
        Check that preview is the posted picture preview
        Retrieve last activities
        Check that last activity correspond to a picture creation
        From second Newebe, retrieve pictures
        From second Newebe, download thumbnail of posted picture
        Check that thumbnail is the posted picture thumbnail
        From second Newebe, posted picture download fails
        From second Newebe, request for download
        From second Newebe, Download preview of first returned picture
        Check that preview is the posted picture preview
        From second Newebe, Download first returned picture
        Ensure it is the same that posted picture
        From second Newebe, retrieve activities
        Check that last activity correspond to a picture creation


    Scenario: Delete picture
        Clear all pictures
        From seconde Newebe, clear all pictures        
        Post a new picture via the dedicated resource
        Retrieve last pictures
        Through handler delete first picture
        Retrieve last pictures
        Check that there are no picture
        From second Newebe, retrieve pictures
        Check that there are no picture
        Retrieve last activities
        Check that last activity correspond to a picture deletion
        From second Newebe, retrieve activities
        Check that last activity correspond to a picture deletion


    Scenario: Retrieve pictures
        Clear all pictures
        Add three pictures to the database with different dates
        Retrieve all pictures through handlers
        Check that there is three pictures with the most recent one as first picture
        Retrieve all pictures before november 2, through handlers
        Check that there is two pictures with the most recent one as first picture

    Scenario: Retrieve picture
        Clear all pictures
        Add three pictures to the database with different dates
        Retrieve all pictures through handlers
        Retrieve first picture hrough handler via its ID.
        Check that picture title is the same that first picture
    

    Scenario: Retrieve My pictures
        Clear all pictures
        Add three pictures to the database with different dates
        Retrieve all pictures through my pictures handlers
        Check that there is two pictures with the most recent one as first picture
        Retrieve all owner pictures before november 1, through handlers
        Check that there is one picture


