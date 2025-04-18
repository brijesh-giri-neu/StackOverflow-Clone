Feature: Adding new answers
  As a user with write access to Fake Stack Overflow
  I want to post an answer to a question
  So that I can help others in the community

  Scenario: Add a new answer successfully
    Given The user has write access to the application "http://localhost:3000"
    And The user navigates to any question to answer
    And clicks the "Answer Question" button
    When The user fills out all necessary fields to post an answer
    And clicks the "Post Answer" button
    Then The user should see the new answer at the top of the answers page
    And The answer should display the username and timestamp

  Scenario Outline: Add an answer with missing fields
    Given The user has write access to the application "http://localhost:3000"
    And The user navigates to any question to answer
    And clicks the "Answer Question" button
    When The user fills out the answer form with all fields except "<missingField>"
    And clicks the "Post Answer" button
    Then The user should see the error "<errorMessage>"
    And The user should see the "Post Answer" button

    Examples:
      | missingField | errorMessage                |
      | text         | Answer text cannot be empty |