Feature: View Tags and their associated question counts
  As a user with read access to Fake Stack Overflow
  I want to see all tags in the system along with the number of questions associated with each tag
  So that I can easily browse topics and their popularity

  Scenario: Display all tags with their question counts
    Given The user has read access to the application "http://localhost:3000"
    When The user clicks on the "Tags" menu item
    Then The user should see a list of tags with their corresponding question counts

  Scenario: Clicking a tag displays all questions associated with that tag
    Given The user is on the homepage "http://localhost:3000"
    When The user navigates to the "Tags" page
    And The user clicks on a tag that has associated questions
    Then The user should see the list of questions related to that tag

  Scenario: Clicking on a tag from the homepage displays related questions
    Given The user is on the homepage "http://localhost:3000"
    When The user clicks on any tag from a question on the homepage
    Then The user should see the list of questions related to that tag
  
  Scenario: Create a new question with tags and verify the tags are displayed
    Given The user is on the homepage "http://localhost:3000"
    When The user creates a new question with tags
    And The user navigates to the "Tags" page
    Then The newly created tags must be visible with the correct question count
  
  Scenario: Create a new question with a new tag and find the question through the tag
    Given The user is on the homepage "http://localhost:3000"
    When The user creates a new question with tags
    And The user navigates to the "Tags" page
    And The user clicks on the newly created tag
    Then The user should see the newly created question
  

  
