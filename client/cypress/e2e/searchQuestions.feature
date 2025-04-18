Feature: Search questions by search string or tag name
  As a user of Fake Stack Overflow
  I want to search questions using search strings or tags
  So that I can find relevant questions easily

  Scenario: Search for a question using text content that does not exist
    Given The user has read access to the application "http://localhost:3000"
    When The user searches for a non-existent text
    Then The user should see no questions matching the search

  Scenario: Search for a question using a keyword present in the question title
    Given The user has read access to the application "http://localhost:3000"
    When The user searches for an existing keyword that is in the question title
    Then The user should see questions that contain the keyword in the title

  Scenario: Search for a question using a keyword present in the question text
    Given The user has read access to the application "http://localhost:3000"
    When The user searches for an existing keyword that is in the question text
    Then The user should see questions that contain the keyword in the text

  Scenario: Search for a question by a tag
    Given The user has read access to the application "http://localhost:3000"
    When The user searches for a tag in the format [tagName]
    Then The user should see questions that are associated with the entered tagName

  Scenario: Search for a question by multiple tags
    Given The user has read access to the application "http://localhost:3000"
    When The user searches for tags [tagName1] [tagName2]
    Then The user should see questions that are associated with both the tags tagName1 and tagName2

  Scenario: Search for a question using a non-existent tag
    Given The user has read access to the application "http://localhost:3000"
    When The user searches for a non-existent tag
    Then The user should see no questions

  Scenario: Search for a question using a combination of text and tags
    Given The user has read access to the application "http://localhost:3000"
    When The user searches for an existing keyword and [tagName]
    Then The user should see questions that match the keyword in the title or text, or are associated with the tag tagName

  Scenario: Search for a question by tag or text from the "Ask a Question" page
    Given The user has read access to the application "http://localhost:3000"
    When The user goes to the "Ask a Question" page
    And The user searches for [tagName]
    Then The user should see questions matching the tag tagName
  
  Scenario: Search for a question by tag or text from the "Answer Question" page
    Given The user has read access to the application "http://localhost:3000"
    And The user navigates to any question
    When The user goes to the "Answer Question" page to answer
    And The user searches for [tagName]
    Then The user should see questions matching the tag tagName

  Scenario: Search for a question by tag or text from the "Tags" page
    Given The user has read access to the application "http://localhost:3000"
    When The user goes to the "Tags" page
    And The user searches for an existing keyword
    Then The user should see questions that contain the keyword in the title or text
