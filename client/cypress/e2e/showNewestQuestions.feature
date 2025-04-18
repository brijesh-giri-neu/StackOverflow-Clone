Feature: Show Questions by newest first
  As a user with read access to Fake Stack Overflow
  I want to see all questions in the database ordered by newest first
  So that I can view the most recently asked questions

  Scenario: Show all questions in newest order on user request
    Given The user can access the homepage "http://localhost:3000"
    And can see the homepage "All Questions"
    When The user clicks on the "Newest" tab
    Then The user should see all questions in the database ordered from newest to oldest

  Scenario Outline: Return to the Newest tab after viewing questions in another order
    Given The user is viewing questions in "<currentOrder>"
    When The user clicks on the "Newest" order
    Then The user should see all questions in the database ordered from newest to oldest

    Examples:
      | currentOrder |
      | Active       |
      | Unanswered   |

  Scenario: Return to Newest after viewing Tags
    Given The user is viewing the homepage "http://localhost:3000"
    When The user clicks on the "Tags" menu item
    And clicks on the "Questions" menu item
    And clicks on the "Newest" tab
    Then The user should see all questions in the database ordered from newest to oldest

  Scenario: View questions in newest order after asking a new question
    Given The user is viewing the homepage "http://localhost:3000"
    And The user clicks on "Ask a Question" and has created a new question
    When The user clicks on the "Newest" tab in the "Questions" page
    Then The user should see the newly created question at the top of the list