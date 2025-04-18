import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

const testUserForLogin = {
    email: "test2@example.com",
    password: "securepassword123",
    displayName: "Test User 2",
};

const testUserForLogin2 = {
    email: "test1@example.com",
    password: "securepassword123",
    displayName: "Test User 1",
};

const Q3_DESC = "Object storage for a web application";
const Q1_DESC = "Programmatically navigate using React router";

// Scenario: Adding a comment
//         Given The user is logged in and viewing a question or an answer
//         When The user enters valid comment text with at least one non-whitespace character and less than 600 characters
//         And Submits the comment
//         Then The comment should appear as the last comment under the post
//         And Be visible to all users
Given('The user is logged in and viewing a question or an answer', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(Q3_DESC).click();
});

When('The user enters valid comment text with at least one non-whitespace character and less than 600 characters', () => {
    cy.get('#commentTextInput').type('This is a valid comment.');
});

When('Submits the comment', () => {
    cy.get('button').contains('Post Comment').click();
});

Then('The comment should appear as the last comment under the post', () => {
    cy.get('.comment-list .comment-item').last().should('contain.text', 'This is a valid comment.');
});

Then('Be visible to all users', () => {
    cy.logout();
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(Q3_DESC).click();
    cy.get('.comment-list .comment-item').last().should('contain.text', 'This is a valid comment.');
});


// Scenario: Submitting a comment with empty text
//         Given The user is logged in and viewing a question or an answer
//         When The user attempts to submit a comment without entering any text
//         Then The user should see an error message: "Cannot post empty comment"
When('The user attempts to submit a comment without entering any text', () => {
    cy.get('#commentTextInput').clear();
    cy.get('.form_postBtn').contains('Post Comment').click();
});

Then('The user should see an error message: "Cannot post empty comment"', () => {
    cy.contains('Cannot post empty comment').should('exist');
});

// Scenario: Editing a comment
//         Given The user is logged in
//         And Has previously posted a comment on a question or answer
//         When The user updates the content of the comment and saves the changes
//         Then The updated comment should replace the original comment
//         And Be visible immediately
Given('The user is logged in', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
});

Given('Has previously posted a comment on a question or answer', () => {
    cy.contains(Q3_DESC).click();
    cy.get('#commentTextInput').type('Original comment');
    cy.get('.form_postBtn').contains('Post Comment').click();
    cy.get('.comment-list .comment-item').last().should('contain.text', 'Original comment');
});

When('The user updates the content of the comment and saves the changes', () => {
    cy.get('.comment-actions button').contains('Edit').click();
    cy.get('#commentTextInput').clear().type('Updated comment');
    cy.get('.form_postBtn').contains('Update Comment').click();
});

Then('The updated comment should replace the original comment', () => {
    cy.get('.comment-list .comment-item').last().should('contain.text', 'Updated comment');
});

Then('Be visible immediately', () => {
    cy.get('.comment-list .comment-item').last().should('contain.text', 'Updated comment');
});


// Scenario: Deleting a comment
//         Given The user is logged in
//         And Has previously posted a comment on a question or answer
//         When The user initiates the deletion process and confirms the action
//         Then The comment should be permanently removed
//         And No longer visible to any user
When('The user initiates the deletion process and confirms the action', () => {
    cy.get('.comment-actions button').contains('Delete').click();
    // Assume immediate deletion — if a modal appears, handle it here
});

Then('The comment should be permanently removed', () => {
    cy.contains('Updated comment').should('not.exist');
});

Then('No longer visible to any user', () => {
    cy.logout();
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(Q3_DESC).click();
    cy.contains('Updated comment').should('not.exist');
});


// Scenario: Show all comments in correct order for a post
//         Given The user is logged in
//         And Is viewing a question or answer with multiple comments
//         Then All associated comments should be displayed in chronological order from oldest to newest

Given('Is viewing a question or answer with multiple comments', () => {
    cy.contains(Q3_DESC).click();
    cy.get('#commentTextInput').type('First comment');
    cy.get('.form_postBtn').contains('Post Comment').click();

    cy.wait(1000);
    cy.get('#commentTextInput').type('Second comment');
    cy.get('.form_postBtn').contains('Post Comment').click();
});

Then('All associated comments should be displayed in chronological order from oldest to newest', () => {
    cy.get('.comment-list .comment-item').eq(0).should('contain.text', 'First comment');
    cy.get('.comment-list .comment-item').eq(1).should('contain.text', 'Second comment');
});


// Scenario: Submitting a comment that exceeds the character limit
//         Given The user is logged in and viewing a question or an answer
//         When The user enters a comment longer than 600 characters
//         And Attempts to submit the comment
//         Then The user should see an error message: "Comment cannot exceed 600 characters"
When('The user enters a comment longer than 600 characters', () => {
    const longText = 'x'.repeat(601);
    cy.get('#commentTextInput').type(longText);
});

When('Attempts to submit the comment', () => {
    cy.get('.form_postBtn').contains('Post Comment').click();
});

Then('The user should see an error message: {string}', (msg) => {
    cy.contains(msg).should('exist');
});

Cypress.Commands.add('logout', () => {
    cy.get('.profile-icon').click();
    cy.contains('Logout').click();
});
