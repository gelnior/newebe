Feature: Authenticate, create user and set password


    Scenario: Log in
        Delete current user
        Set default user
        Save default user
        Open root url
        Checks that response is login page
        Send login request with password as password
        Checks that secure cookie is set
        Open root url
        Checks that response is root page

    Scenario: Log in with wrong password
        Delete current user
        Set default user
        Save default user
        Open root url
        Checks that response is login page
        Send login request with wrong_password as password
        Checks that secure cookie is not set
        Open root url
        Checks that response is login page

    Scenario: Log out
        Delete current user
        Set default user
        Save default user
        Send login request with password as password
        Checks that secure cookie is set
        Open root url
        Checks that response is root page
        Send logout request
        Open root url
        Checks that response is login page

    Scenario: Create user     
        Delete current user   
        Open register url
        Checks that response is register page
        Send creation request for Jhon as user name
        Checks that newebe owner is called Jhon

    Scenario: Set password
        Delete current user   
        Send creation request for Jhon as user name
        Open password registration url
        Checks that response is password registration page
        Send password creation request with password as password
        Send login request with password as password
        Checks that secure cookie is set

    Scenario: Change password
        Delete current user
        Set default user
        Save default user
        Send login request with password as password
        Checks that secure cookie is set
        Change password with password2
        Send logout request
        Send login request with password2 as password
        Checks that secure cookie is set




