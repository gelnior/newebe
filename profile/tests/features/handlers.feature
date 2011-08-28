Feature: Retrieve and edit owner

    Scenario: Retrieve newebe owner
        Delete current user
        Set default user
        Save default user
        Send login request with password as password
        From handler get current user
        Check that current user is the same as saved user


