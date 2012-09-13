Feature: Indexing documents

    Scenario: Indexing microposts
        Given I create five microposts with tags and text
        And I index them
        When I ask for search "dragon"
        Then I got it returns me micropost the micropost about "dragon"

    Scenario: Removing index
        Given I create five microposts with tags and text
        And I index them
        And I remove from index the micropost about "dragon"
        When I ask for search "dragon"
        Then there is no micropost returned

    Scenario: Index link targets
        Given I create three microposts with links
        And I index them 
        When I ask for search "amis"
        Then It returns the micropost about with twitter link
