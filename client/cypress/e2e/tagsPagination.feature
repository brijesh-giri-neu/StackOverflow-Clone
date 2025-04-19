@tagsPagination
Feature: Tags Pagination
    As a user,
    I want to browse tags with pagination,
    So that I can view 20 tags per page and navigate easily.

    Scenario: Displaying first page of tags
        Given the user is on the tags page
        Then 20 tags should be displayed
        And the current page number should be highlighted

    Scenario: Navigating to the next page
        Given the user is on page 1 of the tags list
        When the user clicks the "Next" button
        Then page 2 of the tags should be displayed
        And the current page number should be 2

    Scenario: Navigating to the previous page
        Given the user is on page 2 of the tags list
        When the user clicks the "Prev" button
        Then page 1 of the tags should be displayed
        And the current page number should be 1
