import { Given, When, Then, And, Before } from "cypress-cucumber-preprocessor/steps";
import { createQuestion, createAnswer } from "../../support/utils";
const UNANSWERED_QUESTION = "Unanswered test question";

function seedUnansweredQuestion() {
    cy.visit("http://localhost:3000");
    cy.login(testUserForLogin.email, testUserForLogin.password);

    createQuestion(
        UNANSWERED_QUESTION,
        "This is a test question with no answers.",
        "bdd, test",
        true,
        true
    );

    cy.contains(UNANSWERED_QUESTION);
}

const testUserForLogin = {
    email: "test2@example.com",
    password: "securepassword123",
    displayName: "Test User 2",
};

// Scenario: Show all unanswered questions
//     Given The user can access the homepage "http://localhost:3000"
//     And can see the homepage "All Questions"
//     When The user clicks on the "Unanswered" tab
//     Then The user should see only questions in the database that have no answers

Given('The user can access the homepage to view unanswered {string}', (url) => {
    seedUnansweredQuestion();
    cy.visit(url);
});

And('can see the homepage {string}', (pageTitle) => {
    cy.contains(pageTitle);
});

When('The user clicks on the {string} tab', (tabName) => {
    cy.contains(tabName).click();
});

Then('The user should see only questions in the database that have no answers', () => {
    cy.get(".postTitle").should("contain", UNANSWERED_QUESTION);
});

// Scenario Outline: Return to Unanswered tab after viewing other question orders
//     Given The user is viewing questions in "<currentOrder>"
//     When The user clicks on the "Unanswered" order
//     Then The user should see only questions in the database that have no answers

Given('The user is viewing questions to view unanswered in {string}', (currentOrder) => {
    seedUnansweredQuestion();
    cy.visit("http://localhost:3000");
    cy.contains(currentOrder).click();
});

When('The user clicks on the {string} order', (tabName) => {
    cy.contains(tabName).click();
});

Then('The user should see only questions in the database that have no answers', () => {
    cy.get(".postTitle").should("contain", UNANSWERED_QUESTION);
});

// Scenario: View unanswered questions after answering an existing question
//     Given The user is viewing the homepage "http://localhost:3000"
//     And The user answers a question that was previously unanswered
//     When The user clicks on the "Unanswered" tab
//     Then That question should not appear in the list

Given('The user is viewing the homepage to view unanswered {string}', (url) => {
    seedUnansweredQuestion();
    cy.visit(url);
});

And('The user answers a question that was previously unanswered', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    createAnswer(UNANSWERED_QUESTION, "This is an answer.", true, true);
    cy.contains(UNANSWERED_QUESTION);
});

When('The user clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
});

And('and clicks on the {string} tab', (tabName) => {
    cy.contains(tabName).click();
});

Then('That question should not appear in the list', () => {
    cy.contains("0 questions").should("exist");
});

// Scenario: View unanswered after visiting Tags
//     Given The user is viewing the homepage "http://localhost:3000"
//     When The user clicks on the "Tags" menu item
//     And clicks on the "Questions" menu item
//     And clicks on the "Unanswered" tab
//     Then The user should see only questions in the database that have no answers

Given('The user is viewing the homepage to view unanswered {string}', (url) => {
    seedUnansweredQuestion();
    cy.visit(url);
});

When('The user clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
});

And('clicks on the {string} menu item', (menuItem) => {
    cy.contains(menuItem).click();
});

And('clicks on the {string} tab', (tabName) => {
    cy.contains(tabName).click();
});

Then('The user should see only questions in the database that have no answers', () => {
    cy.get(".postTitle").should("contain", UNANSWERED_QUESTION);
});

