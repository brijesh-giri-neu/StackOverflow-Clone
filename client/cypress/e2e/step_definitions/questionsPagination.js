import { Given, When, Then, And, Before } from "cypress-cucumber-preprocessor/steps";
import { createQuestion } from "../../support/utils";

const testUserForLogin = {
    email: "test2@example.com",
    password: "securepassword123",
    displayName: "Test User 2",
};

Before({ tags: "@questionsPagination" }, () => {
    cy.visit("http://localhost:3000");
    cy.login(testUserForLogin.email, testUserForLogin.password);

    for (let i = 1; i <= 7; i++) {
        createQuestion(
            `Sample Title ${i}`,
            `Sample Text ${i}`,
            `sampletag${i}`,
            true,
            true
        );
        cy.contains("All Questions", { timeout: 5000 });
    }
});

const BASE_URL = "http://localhost:3000";

// Scenario: Displaying first page of questions
//         Given the user is on the questions page
//         Then 10 questions should be displayed
//         And the current page number should be highlighted

Given("the user is on the questions page", () => {
    cy.visit(BASE_URL);
});

Then("10 questions should be displayed", () => {
    cy.get(".question").should("have.length", 10);
});

And("the current page number should be highlighted", () => {
    cy.get(".page-info").should("contain", "Page 1 of");
});

// Scenario: Navigating to the next page
//         Given the user is on page 1 of the questions list
//         When the user clicks the "Next" button
//         Then page 2 of the questions should be displayed
//         And 10 questions should be shown
//         And the current page number should be 2

Given("the user is on page 1 of the questions list", () => {
    cy.visit(BASE_URL);
    cy.get(".page-info").should("contain", "Page 1 of");
});

When('the user clicks the {string} button', (btnLabel) => {
    cy.contains(btnLabel).click();
});

Then("page 2 of the questions should be displayed", () => {
    cy.get(".page-info").should("contain", "Page 2 of");
});

And("the current page number should be 2", () => {
    cy.get(".page-info").should("contain", "Page 2 of");
});

// Scenario: Navigating to the previous page
//         Given the user is on page 2 of the questions list
//         When the user clicks the "Previous" button
//         Then page 1 of the questions should be displayed
//         And the current page number should be 1

Given("the user is on page 2 of the questions list", () => {
    cy.visit(BASE_URL);
    cy.contains("Next").click();
    cy.get(".page-info").should("contain", "Page 2 of");
});

Then("page 1 of the questions should be displayed", () => {
    cy.get(".page-info").should("contain", "Page 1 of");
});

And("the current page number should be 1", () => {
    cy.get(".page-info").should("contain", "Page 1 of");
});
