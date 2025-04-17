Feature: Commenting on Posts
    As a user of the platform
    I want to add, edit, delete, and view comments on questions and answers
    So that I can clarify, contribute to, or refine discussions without modifying the main content

    Scenario: Adding a comment
        Given The user is logged in and viewing a question or an answer
        When The user enters valid comment text with at least one non-whitespace character and less than 600 characters
        And Submits the comment
        Then The comment should appear as the last comment under the post
        And Be visible to all users

    Scenario: Submitting a comment with empty text
        Given The user is logged in and viewing a question or an answer
        When The user attempts to submit a comment without entering any text
        Then The user should see an error message: "Cannot post empty comment"

    Scenario: Editing a comment
        Given The user is logged in
        And Has previously posted a comment on a question or answer
        When The user updates the content of the comment and saves the changes
        Then The updated comment should replace the original comment
        And Be visible immediately

    Scenario: Deleting a comment
        Given The user is logged in
        And Has previously posted a comment on a question or answer
        When The user initiates the deletion process and confirms the action
        Then The comment should be permanently removed
        And No longer visible to any user

    Scenario: Show all comments in correct order for a post
        Given The user is logged in
        And Is viewing a question or answer with multiple comments
        Then All associated comments should be displayed in chronological order from oldest to newest

    Scenario: Submitting a comment that exceeds the character limit
        Given The user is logged in and viewing a question or an answer
        When The user enters a comment longer than 600 characters
        And Attempts to submit the comment
        Then The user should see an error message: "Comment cannot exceed 600 characters"
