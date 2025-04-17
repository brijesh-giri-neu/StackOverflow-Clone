Feature: Voting on Posts
    As a user of the platform
    I want to upvote, downvote, undo, and switch my votes on questions and answers
    So that I can help promote or discourage content based on quality, with accurate vote counts and visual feedback

    Scenario: Upvoting a post
        Given The user is logged in and viewing a post
        When The user clicks the "Upvote" button
        Then The vote count next to the post should increase by 1
        And The "Upvote" button should be visually highlighted

    Scenario: Downvoting a post
        Given The user is logged in and viewing a post
        When The user clicks the "Downvote" button
        Then The vote count next to the post should decrease by 1
        And The "Downvote" button should be visually highlighted

    Scenario: Undoing a vote
        Given The user is logged in and has previously upvoted or downvoted a post
        When The user clicks the same vote button again
        Then The vote count should update accordingly:
            | Action           | Vote Change |
            | Undoing Upvote   | -1          |
            | Undoing Downvote | +1          |
        And Both vote buttons should return to the unselected state

    Scenario: Displaying the vote count
        Given The user is logged in and viewing a post
        When The post loads on the page
        Then The vote count should show the difference between total upvotes and downvotes

    Scenario: Viewing previous votes
        Given The user is logged in and has already voted on a post
        When The user visits that post again
        Then The vote button representing the user’s previous vote should appear highlighted

    Scenario: Switching from downvote to upvote
        Given The user is logged in and has downvoted a post
        When The user clicks the "Upvote" button
        Then The vote count should increase by 2
        And The "Upvote" button should be highlighted
        And The "Downvote" button should be unselected

    Scenario: Switching from upvote to downvote
        Given The user is logged in and has upvoted a post
        When The user clicks the "Downvote" button
        Then The vote count should decrease by 2
        And The "Downvote" button should be highlighted
        And The "Upvote" button should be unselected

    Scenario: Prevent voting on own post
        Given The user is logged in and is viewing their own post
        When The user attempts to vote on their own post
        Then The vote should not be registered
        And The vote count should remain unchanged
        And The user should see an error message: "You cannot vote on your own post"

    Scenario: Preventing multiple votes on a single post within a short time
        Given The user is logged in and viewing a post
        When The user clicks the upvote or downvote button more than once within 5 seconds
        Then The system should block the repeated vote
        And The user should see an error message: "You have already voted on this post. Please wait for sometime before voting again."

    Scenario: Preventing rapid voting across multiple posts
        Given The user is logged in
        And Has voted on a post within the last 5 seconds
        When The user attempts to vote on a different post
        Then The system should block the vote
        And The user should see an error message: "You are voting too quickly. Please wait for sometime before voting again."
