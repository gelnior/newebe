Feature: JSON conversion tools

    Scenario: Creates a list of documents as JSON format
        Creates 3 microposts
        Converts documents to JSON
        Checks that number of JSON documents is equal to 3
        Checks that content of JSON documents are the same as given documents

