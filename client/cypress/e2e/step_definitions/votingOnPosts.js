import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

const postSelector = '.vote_section';
const testUserForLogin = {
    email: "test2@example.com",
    password: "securepassword123",
    displayName: "Test User 2",
};

const Q3_DESC = "Object storage for a web application";
const Q1_DESC = "Programmatically navigate using React router";

// Scenario: Upvoting a post
//         Given The user is logged in and viewing a post
//         When The user clicks the "Upvote" button
//         Then The vote count next to the post should increase by 1
//         And The "Upvote" button should be visually highlighted

Given('The user is logged in and viewing a post', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(Q3_DESC).click();
});

When('The user clicks the Upvote button', () => {
    cy.get('#questionBody button[title="Upvote"]').click();
});

Then('The vote count next to the post should increase by 1', () => {
    cy.get('#questionBody .vote_score')
        .should('not.have.text', '0') // will keep retrying until the vote_score updates
        .invoke('text')
        .then((text) => {
            const score = parseInt(text.trim());
            expect(score).to.equal(1);
        });
});

Then('The "Upvote" button should be visually highlighted', () => {
    cy.get('#questionBody button[title="Upvote"]').should('have.class', 'active_vote');
});


// Scenario: Downvoting a post
//         Given The user is logged in and viewing a post
//         When The user clicks the "Downvote" button
//         Then The vote count next to the post should decrease by 1
//         And The "Downvote" button should be visually highlighted

Given('The user is logged in and viewing a post', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(Q3_DESC).click();
});

When('The user clicks the Downvote button', () => {
    cy.get('#questionBody button[title="Downvote"]').click();
});

Then('The vote count next to the post should decrease by 1', () => {
    cy.get('#questionBody .vote_score')
        .should('not.have.text', '0') // will keep retrying until the vote_score updates
        .invoke('text')
        .then((text) => {
            const score = parseInt(text.trim());
            expect(score).to.equal(-1);
        });
});

Then('The "Downvote" button should be visually highlighted', () => {
    cy.get('#questionBody button[title="Downvote"]').should('have.class', 'active_vote');
});


// Scenario: Undoing a vote
//         Given The user is logged in 
//         And The user has previously upvoted or downvoted a post
//         When The user clicks the same vote button again
//         Then The vote count should update accordingly:
//             | Action           | Vote Change |
//             | Undoing Upvote   | -1          |
//             | Undoing Downvote | +1          |
//         And Both vote buttons should return to the unselected state

Given('The user is logged in', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
});

And('The user has previously upvoted or downvoted a post', () => {
    cy.contains(Q3_DESC).click();
    cy.get('#questionBody button[title="Downvote"]').click();
});

When('The user clicks the same vote button again', () => {
    cy.wait(5000);
    cy.get('#questionBody button[title="Downvote"]').click();
});

Then('The vote count should update accordingly:', (dataTable) => {
    cy.get('#questionBody .vote_score').should('contain', '0');
});

Then('Both vote buttons should return to the unselected state', () => {
    cy.get(`#questionBody button[title="Upvote"]`).should('not.have.class', 'active_vote');
    cy.get(`#questionBody button[title="Downvote"]`).should('not.have.class', 'active_vote');
});


// Scenario: Displaying the vote count
//         Given The user is logged in and viewing a post
//         When The post loads on the page
//         Then The vote count should show the difference between total upvotes and downvotes

Given('The user is logged in and viewing a post', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(Q3_DESC).click();
});

When('The post loads on the page', () => {
    cy.get(postSelector).should('exist');
});

Then('The vote count should show the difference between total upvotes and downvotes', () => {
    cy.get(`${postSelector} .vote_score`).invoke('text').should('match', /^-?\d+$/);
});


// Scenario: Viewing previous votes
//         Given The user is logged in and has already voted on a post
//         When The user visits that post again
//         Then The vote button representing the user’s previous vote should appear highlighted

Given('The user is logged in and has already voted on a post', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(Q3_DESC).click();
    cy.get('#questionBody button[title="Downvote"]').click();
});

When('The user visits that post again', () => {
    cy.contains("Questions").click();
    cy.contains(Q3_DESC).click();
});

Then('The vote button representing the user’s previous vote should appear highlighted', () => {
    cy.get('#questionBody button[title="Downvote"]').should('have.class', 'active_vote');
});

// Scenario: Switching from downvote to upvote
//     Given The user is logged in and has downvoted a post
//     When The user clicks the "Upvote" button
//     Then The vote count should increase by 2
//     And The Upvote button should be highlighted
//     And The Downvote button should be unselected
Given('The user is logged in and has downvoted a post', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(Q3_DESC).click();
    cy.get('#questionBody button[title="Downvote"]').click();
});

When('The user clicks the Upvote button again', () => {
    cy.wait(6000);
    cy.contains("Questions").click();
    cy.contains(Q3_DESC).click();
    cy.get('#questionBody button[title="Upvote"]').click();
});

Then('The vote count should increase by 2', () => {
    cy.get('#questionBody .vote_score').should('contain', '1');
});

Then('The Upvote button should be highlighted', () => {
    cy.get('#questionBody button[title="Upvote"]').should('have.class', 'active_vote');
});

Then('The Downvote button should be unselected', () => {
    cy.get('#questionBody button[title="Downvote"]').should('not.have.class', 'active_vote');
});


// Scenario: Switching from upvote to downvote
//         Given The user is logged in and has upvoted a post
//         When The user clicks the "Downvote" button
//         Then The vote count should decrease by 2
//         And The Downvote button should be highlighted
//         And The Upvote button should be unselected
Given('The user is logged in and has upvoted a post', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(Q3_DESC).click();
    cy.get('#questionBody button[title="Upvote"]').click();
});

When('The user clicks the Downvote button again', () => {
    cy.wait(6000);
    cy.contains("Questions").click();
    cy.contains(Q3_DESC).click();
    cy.get('#questionBody button[title="Downvote"]').click();
});

Then('The vote count should decrease by 2', () => {
    cy.get('#questionBody .vote_score').should('contain', '-1');
});

Then('The Downvote button should be highlighted', () => {
    cy.get('#questionBody button[title="Downvote"]').should('have.class', 'active_vote');
});

Then('The Upvote button should be unselected', () => {
    cy.get('#questionBody  button[title="Upvote"]').should('not.have.class', 'active_vote');
});

// Scenario: Prevent voting on own post
//         Given The user is logged in and is viewing their own post
//         When The user attempts to vote on their own post
//         Then The vote should not be registered
//         And The vote count should remain unchanged
//         And The user should see an error message: "You cannot vote on your own post"
Given('The user is logged in and is viewing their own post', () => {
    cy.login("test1@example.com", "securepassword123");
    cy.contains(Q3_DESC).click();
});

When('The user attempts to vote on their own post', () => {
    cy.get('#questionBody button[title="Upvote"]').click();
});

Then('The vote should not be registered', () => {
    cy.get('#questionBody  button[title="Upvote"]').should('not.have.class', 'active_vote');
});

Then('The vote count should remain unchanged', () => {
    cy.get('#questionBody  .vote_score').should('contain', '0');
});

Then('The user should see an error message: "You cannot vote on your own post"', () => {
    cy.contains('You cannot vote on your own post').should('exist');
});

// Scenario: Preventing multiple votes on a single post within a short time
//         Given The user is logged in and viewing a post
//         When The user clicks the upvote or downvote button more than once within 5 seconds
//         Then The system should block the repeated vote
//         And The user should see an error message: "You have already voted on this post. Please wait for sometime before voting again."
Given('The user is logged in and viewing a post', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(Q3_DESC).click();
});

When('The user clicks the upvote or downvote button more than once within 5 seconds', () => {
    cy.get('#questionBody button[title="Upvote"]').click();
    cy.wait(2000);
    cy.get('#questionBody button[title="Upvote"]').click();
});

Then('The system should block the repeated vote', () => {
    cy.get('#questionBody .vote_score').should('contain', '1');
});

Then('The user should see an error message: {string}', (msg) => {
    cy.contains(msg).should('exist');
});

// Scenario: Preventing rapid voting across multiple posts
//         Given The user is logged in
//         And Has voted on a post within the last 5 seconds
//         When The user attempts to vote on a different post
//         Then The system should block the vote
//         And The user should see an error message: "You are voting too quickly. Please wait for sometime before voting again."
Given('The user is logged in', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
});

And('Has voted on a post within the last 5 seconds', () => {
    cy.contains(Q3_DESC).click();
    cy.get('#questionBody button[title="Upvote"]').click();
    cy.wait(2000);
});

When('The user attempts to vote on a different post', () => {
    cy.contains("Questions").click();
    cy.contains(Q1_DESC).click();
    cy.get('#questionBody button[title="Upvote"]').click();
});

Then('The system should block the vote', () => {
    cy.get('#questionBody .vote_score').should('contain', '0');
});

Then('The user should see an error message: {string}', (msg) => {
    cy.contains(msg).should('exist');
});


Cypress.Commands.add("login", (email, password) => {
    console.log("{email}");
    console.log(password);
    cy.visit("http://localhost:3000");
    cy.get('button').contains("Log in").click();
    cy.get("#formEmailInput").type(email);
    cy.get("#formPasswordInput").type(password);
    cy.contains("Login").click();
});