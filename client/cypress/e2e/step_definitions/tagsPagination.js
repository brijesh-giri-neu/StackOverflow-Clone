import { Given, When, Then, And, Before } from "cypress-cucumber-preprocessor/steps";
import { createQuestion } from "../../support/utils";

const testUserForLogin = {
    email: "test2@example.com",
    password: "securepassword123",
    displayName: "Test User 2",
};

Before({ tags: "@tagsPagination" }, () => {
    cy.visit("http://localhost:3000");
    cy.login(testUserForLogin.email, testUserForLogin.password);

    for (let i = 1; i <= 5; i++) {
        createQuestion(
            `Tag Pagination Title ${i}`,
            `This is the body of tag question ${i}`,
            `paginationtag${i} paginationtag${i + 6} paginationtag${i + 11} paginationtag${i + 16}`, // unique tag per question
            true,
            true
        );
        cy.contains("All Questions", { timeout: 5000 });
    }

    // navigate to tag page
    cy.contains("Tags").click();
});

const BASE_URL = "http://localhost:3000";

// Scenario: Displaying first page of tags
//         Given the user is on the tags page
//         Then 20 tags should be displayed
//         And the current page number should be highlighted
Given("the user is on the tags page", () => {
    cy.visit(BASE_URL);
    cy.contains("Tags").click();
    cy.get(".page-info").should("contain", "Page 1 of");
});

// First Scenario: 20 tags displayed
Then("20 tags should be displayed", () => {
    cy.get(".tag_list .tagNode").should("have.length", 20);
});

And("the current page number should be highlighted", () => {
    cy.get(".page-info").should("contain", "Page 1 of");
});

// Scenario: Navigating to the next page
//         Given the user is on page 1 of the tags list
//         When the user clicks the "Next" button
//         Then page 2 of the tags should be displayed
//         And 20 tags should be shown
//         And the current page number should be 2
Given("the user is on page 1 of the tags list", () => {
    cy.visit(BASE_URL);
    cy.contains("Tags").click();
    cy.get(".page-info").should("contain", "Page 1 of");
});

When('the user clicks the {string} button', (label) => {
    cy.contains(btnLabel).click();
});

Then("page 2 of the tags should be displayed", () => {
    cy.get(".page-info").should("contain", "Page 2 of");
});

And("20 tags should be shown", () => {
    cy.get(".tag_list .tagNode").should("have.length", 20);
});

And("the current page number should be 2", () => {
    cy.get(".page-info").should("contain", "Page 2 of");
});

// Scenario: Navigating to the previous page
//         Given the user is on page 2 of the tags list
//         When the user clicks the "Prev" button
//         Then page 1 of the tags should be displayed
//         And the current page number should be 1
Given("the user is on page 2 of the tags list", () => {
    cy.visit(BASE_URL);
    cy.contains("Tags").click();
    cy.contains("Next").click();
    cy.get(".page-info").should("contain", "Page 2 of");
});

Then("page 1 of the tags should be displayed", () => {
    cy.get(".page-info").should("contain", "Page 1 of");
});

And("the current page number should be 1", () => {
    cy.get(".page-info").should("contain", "Page 1 of");
});