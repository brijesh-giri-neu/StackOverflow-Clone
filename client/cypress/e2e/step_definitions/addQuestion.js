import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
import { createQuestion } from "../../support/utils";

const newQuestion = {
    title: "How to add a question to the database?",
    text: "I am trying to add a question to the database using JavaScript, but I am not sure how to do it. Can someone help me?",
    tags: "database javascript",
    user: "elephantCDE"
}

const testUserForLogin = {
    email: "test2@example.com",
    password: "securepassword123",
    displayName: "Test User 2",
};

// Scenario: Add a new question successfully
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fills out the necessary fields
//     And clicks the "Post Question" button
//     Then The user should see the new question in the All Questions page with the metadata information

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
    cy.login(testUserForLogin.email, testUserForLogin.password);
});

When('The user clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

And('fills out the necessary fields', () => {
    createQuestion(newQuestion.title, newQuestion.text, newQuestion.tags, false, false);
});

And('clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

Then('The user should see the new question in the All Questions page with the metadata information', () => {
    cy.contains("All Questions");
    cy.get(".postTitle").first().should("contain", newQuestion.title);
    cy.get(".question_author").first().should("contain", testUserForLogin.displayName);
    cy.get(".question_meta").first().should("contain", "0 seconds");
});


// Scenario Outline: Add a question with missing fields
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fills out the form with all necessary fields except "<missingField>"
//     And clicks the "Post Question" button
//     Then The user should see the error "<errorMessage>"
//     And The user should see the "Post Question" button

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
    cy.login(testUserForLogin.email, testUserForLogin.password);
});

When('The user clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

And('fills out the form with all necessary fields except {string}', (missingField) => {
    let q = {...newQuestion, [missingField]: ''}
    createQuestion(q.title, q.text, q.tags, false, false);
});

And('clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

Then('The user should see the error {string}', (errorMessage) => {
    cy.contains(errorMessage);
});

And('The user should see the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});