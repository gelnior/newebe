Feature: Resizing images

    Scenario: Resizing image
        Given I have a test image
        When I resize it to 300 x 300
        Then I have a 300 x 300 image
