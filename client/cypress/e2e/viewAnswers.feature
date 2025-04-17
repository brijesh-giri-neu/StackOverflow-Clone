Feature: Viewing Answers to Questions
  As a user with read access to Fake Stack Overflow
  I want to view the answers to a question
  So that I can see solutions provided by others

  Scenario: Viewing answers for a specific question
    Given The user has read access to the application at "http://localhost:3000"
    And A question with answers is available
    When The user selects the question
    Then The user should see all answers displayed on the page
