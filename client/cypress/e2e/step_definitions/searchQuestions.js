import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

const Q1_DESC = "Programmatically navigate using React router";
const Q2_DESC = "android studio save string shared preference, start activity and load the saved string";
const Q3_DESC = "Object storage for a web application";
const Q4_DESC = "Quick question about storage on android";

const testUserForLogin = {
    email: "test2@example.com",
    password: "securepassword123",
    displayName: "Test User 2",
};

// Scenario: Search for a question using text content that does not exist
//     Given The user has read access to the application "http://localhost:3000"
//     When The user searches for a non-existent text
//     Then The user should see no questions matching the search

Given('The user has read access to the application {string}', (url) => {
    cy.visit(url);
});

When('The user searches for a non-existent text', () => {
    const searchText = "Web3";
    cy.get('#searchBar').clear().type(`${searchText}{enter}`);
});

Then('The user should see no questions matching the search', () => {
    cy.get('.postTitle').should('have.length', 0);
});

// Scenario: Search for a question using a keyword present in the question title
//     Given The user has read access to the application "http://localhost:3000"
//     When The user searches for an existing keyword that is in the question title
//     Then The user should see questions that contain the keyword in the title

When('The user searches for an existing keyword that is in the question title', () => {
    const searchText = "android studio";
    cy.get('#searchBar').type(`${searchText}{enter}`);
});

Then('The user should see questions that contain the keyword in the title', () => {
    const qTitles = [Q4_DESC, Q2_DESC];
    cy.verifyPostTitles(qTitles);
});

// Scenario: Search for a question using a keyword present in the question text
//     Given The user has read access to the application "http://localhost:3000"
//     When The user searches for an existing keyword that is in the question text
//     Then The user should see questions that contain the keyword in the text

When('The user searches for an existing keyword that is in the question text', () => {
    const searchText = "40 million";
    cy.get('#searchBar').type(`${searchText}{enter}`);
});

Then('The user should see questions that contain the keyword in the text', () => {
    const qTitles = [Q3_DESC];
    cy.verifyPostTitles(qTitles);
});

// Scenario: Search for a question by a tag
//     Given The user has read access to the application "http://localhost:3000"
//     When The user searches for a tag in the format [tagName]
//     Then The user should see questions that are associated with the entered tagName

When('The user searches for a tag in the format [tagName]', () => {
    const searchText = "[react]";
    cy.get('#searchBar').type(`${searchText}{enter}`);
});

Then('The user should see questions that are associated with the entered tagName', () => {
    const qTitles = [Q1_DESC];
    cy.verifyPostTitles(qTitles);
});

// Scenario: Search for a question by multiple tags
//     Given The user has read access to the application "http://localhost:3000"
//     When The user searches for tags [tagName1] [tagName2]
//     Then The user should see questions that are associated with both the tags tagName1 and tagName2

When('The user searches for tags [tagName1] [tagName2]', () => {
    const searchText = "[android-studio] [shared-preferences]";
    cy.get('#searchBar').type(`${searchText}{enter}`);
});

Then('The user should see questions that are associated with both the tags tagName1 and tagName2', () => {
    const qTitles = [Q4_DESC, Q2_DESC];
    cy.verifyPostTitles(qTitles);
});

// Scenario: Search for a question using a non-existent tag
//     Given The user has read access to the application "http://localhost:3000"
//     When The user searches for a non-existent tag
//     Then The user should see no questions

When('The user searches for a non-existent tag', () => {
    const searchText = "[non-existent]";
    cy.get('#searchBar').type(`${searchText}{enter}`);
});

Then('The user should see no questions', () => {
    cy.get('.postTitle').should('have.length', 0);
});

// Scenario: Search for a question using a combination of text and tags
//     Given The user has read access to the application "http://localhost:3000"
//     When The user searches for an existing keyword and [tagName]
//     Then The user should see questions that match the keyword in the title or text, or are associated with the tag tagName

When('The user searches for an existing keyword and [tagName]', () => {
    const searchText = "shared preference [react]";
    cy.get('#searchBar').type(`${searchText}{enter}`);
});

Then('The user should see questions that match the keyword in the title or text, or are associated with the tag tagName', () => {
    const qTitles = [Q2_DESC, Q1_DESC];
    cy.verifyPostTitles(qTitles);
});

// Scenario: Search for a question by tag from the "Ask a Question" page
//     Given The user has read access to the application "http://localhost:3000"
//     When The user goes to the "Ask a Question" page
//     And The user searches for [tagName]
//     Then The user should see questions matching the tag tagName

When('The user goes to the {string} page', (sectionName) => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(sectionName).click();
});

And('The user searches for [tagName]', () => {
    const searchText = "[react]";
    cy.get('#searchBar').type(`${searchText}{enter}`);
});

Then('The user should see questions matching the tag tagName', () => {
    const qTitles = [Q1_DESC];
    cy.verifyPostTitles(qTitles);
});

// Scenario: Search for a question by tag or text from the "Answer Question" page
//     Given The user has read access to the application "http://localhost:3000"
//     And The user navigates to any question
//     When The user goes to the "Answer Question" page
//     And The user searches for [tagName]
//     Then The user should see questions matching the tag tagName

And('The user navigates to any question', () => {
    cy.contains(Q2_DESC).click();
});

When('The user goes to the {string} page', (sectionName) => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(sectionName).click();
});

And('The user searches for [tagName]', () => {
    const searchText = "[react]";
    cy.get('#searchBar').type(`${searchText}{enter}`);
});

Then('The user should see questions matching the tag tagName', () => {
    const qTitles = [Q1_DESC];
    cy.verifyPostTitles(qTitles);
});

// Scenario: Search for a question using a text query from the "Tags" page
//     Given The user has read access to the application "http://localhost:3000"
//     When The user goes to the "Tags" page
//     And The user searches for an existing keyword
//     Then The user should see questions that contain the keyword in the title or text

When('The user goes to the {string} page', (sectionName) => {
    cy.contains(sectionName).click();
});

And('The user searches for an existing keyword', () => {
    const searchText = "android studio";
    cy.get('#searchBar').type(`${searchText}{enter}`);
});

Then('The user should see questions that contain the keyword in the title or text', () => {
    const qTitles = [Q4_DESC, Q2_DESC];
    cy.verifyPostTitles(qTitles);
});

/**
 * Verifies that elements matching the selector contain the expected text values in order.
 */
Cypress.Commands.add('verifyPostTitles', (expectedTitles) => {
    cy.get('.postTitle').should('have.length.at.least', expectedTitles.length);

    expectedTitles.forEach((title, index) => {
        cy.get('.postTitle').eq(index).should('contain.text', title);
    });
});