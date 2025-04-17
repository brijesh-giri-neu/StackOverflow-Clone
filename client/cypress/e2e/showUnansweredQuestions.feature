@showUnansweredQuestions
Feature: Show unanswered questions
  As a user with read access to Fake Stack Overflow
  I want to view only the questions that have not been answered yet
  So that I can help answer them or learn which topics are lacking responses

  Scenario: Show all unanswered questions
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When The user clicks on the "Unanswered" tab
    Then The user should see only questions in the database that have no answers

  Scenario Outline: Return to Unanswered tab after viewing other question orders
    Given The user is viewing questions in "<currentOrder>"
    When The user clicks on the "Unanswered" order
    Then The user should see only questions in the database that have no answers

    Examples:
      | currentOrder |
      | Newest       |
      | Active       |

  Scenario: View unanswered questions after answering an existing question
    Given The user is viewing the homepage "http://localhost:3000"
    And The user answers a question that was previously unanswered
    When The user clicks on the "Questions" menu item
    And clicks on the "Unanswered" tab
    Then That question should not appear in the list

  Scenario: View unanswered after visiting Tags
    Given The user is viewing the homepage "http://localhost:3000"
    When The user clicks on the "Tags" menu item
    And clicks on the "Questions" menu item
    And clicks on the "Unanswered" tab
    Then The user should see only questions in the database that have no answers