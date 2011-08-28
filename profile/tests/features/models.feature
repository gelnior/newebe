Feature: Retrieve user
    Scenario: Convert user to dictionnary
        Set default user
        Convert user to dict
        Check that dict conversion is correct

    Scenario: Connvert user to JSON
        Set default user
        Convert user to json
        Check that JSON conversion is correct

    Scenario: Retrieve newebe owner
        Delete current user
        Set default user
        Save default user
        Get current user
        Check that current user is the same as saved user

    Scenario: Save default user and automatically set key
        Delete current user
        Set default user
        Save default user
        Check that user key is properly set

    Scenario: Save default user and automatically set key
        Delete current user
        Set default user
        Convert default user to contact
        Check that contact has same properties as default user


