import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

const Q3_DESC = "Object storage for a web application";
const A6_TXT = "Storing content as BLOBs in databases.";
const A7_TXT = "Using GridFS to chunk and store content.";

// Scenario: Viewing answers for a specific question
//     Given The user has read access to the application at "http://localhost:3000"
//     And A question with answers is available
//     When The user selects the question
//     Then The user should see all answers displayed on the page

Given('The user has read access to the application at {string}', (url) => {
    cy.visit(url);
});

And('A question with answers is available', () => {
    cy.contains(Q3_DESC);
    cy.contains("2 answers");
});

When('The user selects the question', () => {
    cy.contains(Q3_DESC).click();
});

Then('The user should see all answers displayed on the page', () => {
    cy.get(".answerText").should('have.length.greaterThan', 0);

    const answers = [A6_TXT, A7_TXT];
    answers.forEach(answer => {
        cy.contains(answer).should('be.visible');
    });
});
