Feature: Extract data from url

    Scenario: Extract port and host from URL
        When I extract data from url "http://localhost:8000/"
        Then I have "localhost" and 8000 as results
        When I extract data from url "http://www.google.fr/"        
        Then I have "www.google.fr" and 80 as results
