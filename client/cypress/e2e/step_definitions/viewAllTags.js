import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
import { createQuestion } from "../../support/utils";

const tagData = [
    { tag: 'react', questions: 1 },
    { tag: 'javascript', questions: 2 },
    { tag: 'android-studio', questions: 2 },
    { tag: 'shared-preferences', questions: 2 },
    { tag: 'storage', questions: 2 },
    { tag: 'website', questions: 1 },
];

const testUserForLogin = {
    email: "test2@example.com",
    password: "securepassword123",
    displayName: "Test User 2",
};

const Q1_DESC = "Programmatically navigate using React router";

const newQuestion = {
    title: "How to add a question to the database?",
    text: "I am trying to add a question to the database using JavaScript, but I am not sure how to do it. Can someone help me?",
    tags: "connectingDatabase integration",
    user: "interops26"
}

// utility function to verify tag visibility and question count
function verifyTagCount(tag, count = 1) {
    cy.contains(tag).should('be.visible');
    cy.contains(tag).parent().should('contain.text', `${count} question`);
}

// utility function to verify that the specified tag is visible & related question is displayed.
function verifyQuestionsForTag(tag, questionTitle) {
    cy.contains(tag).should('be.visible');
    cy.get('.postTitle').should('contain.text', questionTitle);
}


// Scenario: Display all tags with their question counts
//     Given The user has read access to the application "http://localhost:3000"
//     When The user clicks on the "Tags" menu item
//     Then The user should see a list of tags with their corresponding question counts

Given('The user has read access to the application {string}', (url) => {
    cy.visit(url);
});

When('The user clicks on the {string} menu item', (sectionName) => {
    cy.contains(sectionName).click();
});

Then('The user should see a list of tags with their corresponding question counts', () => {
    tagData.forEach(({ tag, questions }) => {
        verifyTagCount(tag, questions);
    });
});

// Scenario: Clicking a tag displays all questions associated with that tag
//     Given The user is on the homepage "http://localhost:3000"
//     When The user navigates to the "Tags" page
//     And The user clicks on a tag that has associated questions
//     Then The user should see the list of questions related to that tag

Given('The user is on the homepage {string}', (url) => {
    cy.visit(url);
});

When('The user navigates to the {string} page', (sectionName) => {
    cy.contains(sectionName).click();
});

And('The user clicks on a tag that has associated questions', () => {
    cy.contains(tagData[0].tag).click();
});

Then('The user should see the list of questions related to that tag', () => {
    verifyQuestionsForTag(tagData[0].tag, Q1_DESC)
});

// Scenario: Clicking on a tag from the homepage displays related questions
//     Given The user is on the homepage "http://localhost:3000"
//     When The user clicks on any tag from a question on the homepage
//     Then The user should see the list of questions related to that tag

Given('The user is on the homepage {string}', (url) => {
    cy.visit(url);
});

When('The user clicks on any tag from a question on the homepage', () => {
    const tag = tagData[0].tag;
    cy.contains(tag).click();
});

Then('The user should see the list of questions related to that tag', () => {
    verifyQuestionsForTag(tagData[0].tag, Q1_DESC)
});

// Scenario: Create a new question with tags and verify the tags are displayed
//     Given The user is on the homepage "http://localhost:3000"
//     When The user creates a new question with tags
//     And The user navigates to the "Tags" page
//     Then The newly created tags must be visible with the correct question count

Given('The user is logged in and on the homepage {string}', (url) => {
    cy.visit(url);
    cy.login(testUserForLogin.email, testUserForLogin.password);
});

When('The user creates a new question with tags', () => {
    createQuestion(newQuestion.title, newQuestion.text, newQuestion.tags, true, true);
    cy.contains("All Questions");
});

And('The user navigates to the {string} page', (sectionName) => {
    cy.contains(sectionName).click();
});

Then('The newly created tags must be visible with the correct question count', () => {
    verifyTagCount('connectingDatabase', 1);
    verifyTagCount('integration', 1);
});

//   Scenario: Create a new question with a new tag and find the question through the tag
//     Given The user is on the homepage "http://localhost:3000"
//     When The user creates a new question with tags
//     And The user navigates to the "Tags" page
//     And The user clicks on the newly created tag
//     Then The user should see the newly created question

Given('The user is logged in and on the homepage {string}', (url) => {
    cy.visit(url);
    cy.login(testUserForLogin.email, testUserForLogin.password);
});

When('The user creates a new question with tags', () => {
    createQuestion(newQuestion.title, newQuestion.text, newQuestion.tags, true, true);
    cy.contains("All Questions");
});

And('The user navigates to the {string} page', (sectionName) => {
    cy.contains(sectionName).click();
});

And('The user clicks on the newly created tag', (sectionName) => {
    cy.contains("integration").click();
});

Then('The user should see the newly created question', () => {
    verifyQuestionsForTag('integration', newQuestion.title);
});