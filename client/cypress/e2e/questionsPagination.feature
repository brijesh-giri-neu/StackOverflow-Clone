@questionsPagination
Feature: Questions Pagination
    As a user,
    I want to navigate through paginated questions,
    So that I can browse them in chunks of 10 per page.

    Scenario: Displaying first page of questions
        Given the user is on the questions page
        Then 10 questions should be displayed
        And the current page number should be highlighted

    Scenario: Navigating to the next page
        Given the user is on page 1 of the questions list
        When the user clicks the "Next" button
        Then page 2 of the questions should be displayed
        And the current page number should be 2

    Scenario: Navigating to the previous page
        Given the user is on page 2 of the questions list
        When the user clicks the "Prev" button
        Then page 1 of the questions should be displayed
        And the current page number should be 1
