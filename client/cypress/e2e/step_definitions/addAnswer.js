import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
import { createAnswer } from "../../support/utils";

const newAnswer = {
    text: "This is a helpful answer to the question."
};
const Q1_DESC = "Programmatically navigate using React router";

const testUserForLogin = {
    email: "test2@example.com",
    password: "securepassword123",
    displayName: "Test User 2",
};

// Scenario: Add a new answer successfully
//     Given The user has write access to the application "http://localhost:3000"
//     And The user navigates to any question to answer
//     And clicks the "Answer Question" button
//     When The user fills out all necessary fields to post an answer
//     And clicks the "Post Answer" button
//     Then The user should see the new answer at the top of the answers page
//     And The answer should display the username and timestamp

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
    cy.login(testUserForLogin.email, testUserForLogin.password);
});

And('The user navigates to any question to answer', () => {
    cy.contains(Q1_DESC).click();
});

And('clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

When('The user fills out all necessary fields to post an answer', () => {
    createAnswer(null, newAnswer.text, false)
});

And('clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

Then('The user should see the new answer at the top of the answers page', () => {
    cy.get(".answerText").first().should("contain", newAnswer.text);
});

And('The answer should display the username and timestamp', () => {
    cy.contains(testUserForLogin.displayName);
    cy.contains("0 seconds ago");
});

// Scenario Outline: Add an answer with missing fields
//     Given The user has write access to the application "http://localhost:3000"
//     And The user navigates to any question to answer
//     And clicks the "Answer Question" button
//     When The user fills out the answer form with all fields except "<missingField>"
//     And clicks the "Post Answer" button
//     Then The user should see the error "<errorMessage>"
//     And The user should see the "Post Answer" button

Given('The user has write access to the application {string}', (url) => {
    cy.visit(url);
    cy.login(testUserForLogin.email, testUserForLogin.password);
});

And('The user navigates to any question to answer', () => {
    cy.contains(Q1_DESC).click();
});

And('clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

When('The user fills out the answer form with all fields except {string}', (missingField) => {
    let a = { ...newAnswer, [missingField]: '' };
    createAnswer(null, a.text, false)
});

And('clicks the {string} button', (buttonName) => {
    cy.contains(buttonName).click();
});

Then('The user should see the error {string}', (errorMessage) => {
    cy.contains(errorMessage);
});

And('The user should see the {string} button', (buttonName) => {
    cy.contains('button', buttonName).should('be.visible');
});