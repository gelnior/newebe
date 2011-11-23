Feature: Retrieve contacts


    Scenario: Get contacts
        Deletes contacts
        Creates contacts
        Get contacts
        Check that there is 3 contacts

    Scenario: Get contacts depending on their status
        Deletes contacts
        Creates contacts
        Get requested contacts
        Check that there is 1 contacts
        Get pending contacts
        Check that there is 1 contacts
        Get trusted contacts
        Check that there is 1 contacts
        
    Scenario: Get contact from its slug
        Deletes contacts
        Creates contacts
        Get contact with slug : toto
        Check contact is null
        Get contact with slug : httplocalhost1
        Check contact is not null

    Scenario: Get trusted contact from its key
        Deletes contacts
        Creates contacts
        Get trusted contact with key : key1
        Check contact is null
        Get trusted contact with key : key2
        Check contact is not null

