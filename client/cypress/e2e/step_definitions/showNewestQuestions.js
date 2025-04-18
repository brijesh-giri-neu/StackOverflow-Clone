import { Given, When, Then, And, Before, After } from "cypress-cucumber-preprocessor/steps";
import { createQuestion } from "../../support/utils";

// Reset DB before and after each test
Before(() => {
    cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
    cy.exec("npm run --prefix ../server populate_db mongodb://127.0.0.1:27017/fake_so");
});

After(() => {
    cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
});

const testUserForLogin = {
    email: "test2@example.com",
    password: "securepassword123",
    displayName: "Test User 2",
};

// Titles used in seeded data
const Q1_TITLE = "Programmatically navigate using React router";
const Q2_TITLE = "android studio save string shared preference, start activity and load the saved string";
const Q3_TITLE = "Object storage for a web application";
const Q4_TITLE = "Quick question about storage on android";
const Q5_TITLE = "Test Question A"; // User-generated question

const initialNewestOrder = [
    Q4_TITLE,
    Q3_TITLE,
    Q2_TITLE,
    Q1_TITLE
];

// Utility to verify order of questions by newest
function verifyNewestOrder(expectedTitles) {
    cy.get(".postTitle").each(($el, index, $list) => {
        cy.wrap($el).should("contain", expectedTitles[index]);
    });
}

// Scenario: Show all questions in newest order on user request
//     Given The user can access the homepage "http://localhost:3000"
//     And can see the homepage "All Questions"
//     When The user clicks on the "Newest" tab
//     Then The user should see all questions in the database ordered from newest to oldest

Given('The user can access the homepage {string}', (url) => {
    cy.visit(url);
});

And('can see the homepage {string}', (pageName) => {
    cy.contains(pageName);
});

When('The user clicks on the {string} tab', (tabName) => {
    cy.contains(tabName).click();
});

Then('The user should see all questions in the database ordered from newest to oldest', () => {
    verifyNewestOrder(initialNewestOrder);
});

// Scenario Outline: Return to the Newest tab after viewing questions in another order
//     Given The user is viewing questions in "<currentOrder>"
//     When The user clicks on the "Newest" order
//     Then The user should see all questions in the database ordered from newest to oldest

Given('The user is viewing questions in {string}', (currentOrder) => {
    cy.visit("http://localhost:3000");
    cy.contains(currentOrder).click();
});

When('The user clicks on the {string} order', (tabName) => {
    cy.contains(tabName).click();
});

Then('The user should see all questions in the database ordered from newest to oldest', () => {
    verifyNewestOrder(initialNewestOrder);
});

// Scenario: Return to Newest after viewing Tags
//     Given The user is viewing the homepage "http://localhost:3000"
//     When The user clicks on the "Tags" menu item
//     And clicks on the "Questions" menu item
//     And clicks on the "Newest" tab
//     Then The user should see all questions in the database ordered from newest to oldest

Given('The user is viewing the homepage {string}', (url) => {
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

Then('The user should see all questions in the database ordered from newest to oldest', () => {
    verifyNewestOrder(initialNewestOrder);
});

// Scenario: View questions in newest order after asking a new question
//     Given The user is viewing the homepage "http://localhost:3000"
//     And The user clicks on "Ask a Question" and has created a new question
//     When The user clicks on the "Newest" tab in the "Questions" page
//     Then The user should see the newly created question at the top of the list

Given('The user is viewing the homepage {string}', (url) => {
    cy.visit(url);
});

And('The user clicks on {string} and has created a new question', (buttonName) => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains(buttonName).click();
    createQuestion(Q5_TITLE, "Test Question A Text", "javascript", false, true);
    cy.contains("All Questions");
});

When('The user clicks on the {string} tab in the {string} page', (tabName, pageName) => {
    cy.contains(pageName).click();
    cy.contains(tabName).click();
});

Then('The user should see the newly created question at the top of the list', () => {
    cy.get(".postTitle").first().should("contain", Q5_TITLE);
});