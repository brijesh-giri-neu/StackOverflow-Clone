import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

const testUserForRegistration = {
    email: "test6@example.com",
    password: "securepassword123",
    displayName: "Test User 6",
};

const testUserForLogin = {
    email: "test2@example.com",
    password: "securepassword123",
    displayName: "Test User 2",
};

const testValues = {
    "Display Name": "TestUser123",
    "Location": "Testville",
    "Title": "Engineer of Chaos",
    "About Me": "Just testing things",
    "Website Link": "https://test.dev",
    "X Link": "https://x.com/testy",
    "GitHub Link": "https://github.com/testy",
};

// Scenario: User successfully registers a new account
//         Given The user is on the registration page
//         When The user enters a valid email, password, and display name
//         And Submits the registration form
//         Then The user should see a registration confirmation
//         And Be logged into their new account and redirected to the questions page

Given('The user is on the registration page {string}', (url) => {
    cy.visit(url);
    cy.get('button').contains("Sign up").click();
});

When('The user enters a valid email, password, and display name', () => {
    cy.get('#formEmailInput').type(testUserForRegistration.email);
    cy.get('#formPasswordInput').type(testUserForRegistration.password);
    cy.get('#formDisplayNameInput').type(testUserForRegistration.displayName);
});

And('Submits the registration form', () => {
    cy.get('button').contains("Register").click();
});

Then('The user should see a registration confirmation', () => {
    cy.contains("User registered successfully").should("exist");
});

And('Be logged into their new account and redirected to the questions page', () => {
    cy.contains("All Questions");
});

// Scenario: User logs in with valid credentials
//         Given The user is on the login page "http://localhost:3000"
//         When The user enters a valid email and password
//         Then The user should be redirected to the questions page

Given('The user is on the login page {string}', (url) => {
    cy.visit(url);
    cy.get('button').contains("Log in").click();
});

When('The user enters a valid email and password', () => {
    cy.get('#formEmailInput').type(testUserForLogin.email);
    cy.get('#formPasswordInput').type(testUserForLogin.password);
    cy.get('button').contains("Login").click();
});

Then('The user should be redirected to the questions page', () => {
    cy.contains("All Questions");
    cy.get('button').contains("Ask a Question")
});

// Scenario: User logs out successfully
//         Given The user is logged in and is on any page of the application
//         When The user chooses to log out
//         Then The user should be redirected to the login page
//         And See a message indicating successful logout

Given('The user is logged in and is on any page of the application', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.contains("All Questions");
});

When('The user chooses to log out', () => {
    cy.get('.profile-icon').click();
    cy.contains("Logout").click();
});

Then('The user should be redirected to the login page', () => {
    cy.get('button').contains("Login")
});

And('See a message indicating successful logout', () => {
    cy.contains("Logged out successfully").should("exist");
});


// Scenario Outline: User updates their profile information
//         Given The user is logged in and on the profile settings page
//         When The user updates the "<Field>" field
//         Then The system should save the changes and reflect the updated "<Field>" on the user's public profile

Given('The user is logged in and on the profile settings page', () => {
    cy.login(testUserForLogin.email, testUserForLogin.password);
    cy.get('.profile-icon').click();
});

When('The user updates the {string} field', (field) => {
    cy.contains("Edit").click();
    const fieldIdMap = {
        "Display Name": "#displayName",
        "Location": "#location",
        "Title": "#title",
        "About Me": "#aboutMe",
        "Full Name": "#fullName",
        "Website Link": "#website",
        "X Link": "#twitter",
        "GitHub Link": "#github"
    };

    const selector = fieldIdMap[field];
    const value = testValues[field];

    cy.get(selector).clear().type(value);
    cy.contains('Save Profile').click();
});

Then('The system should save the changes and reflect the updated {string} on the user\'s public profile', (field) => {
    const value = testValues[field];
    if (["Website Link", "X Link", "GitHub Link"].includes(field)) {
        const linkTextMap = {
            "Website Link": "Website",
            "X Link": "Twitter",
            "GitHub Link": "GitHub"
        };
        cy.get(`a`)
            .contains(linkTextMap[field])
            .should('have.attr', 'href', value);
    } else {
        cy.contains(value).should('exist');
    }
});

// Scenario: User deletes their account
//         Given The user is logged in and on the profile settings page
//         When The user initiates the account deletion process and confirms the deletion
//         Then The account should be deactivated
//         And The user should be logged out

When('The user initiates the account deletion process and confirms the deletion', () => {
    cy.contains("Delete").click();
});

Then('The account should be deactivated', () => {
    cy.contains("Account deleted successfully").should("exist");
});

And('The user should be logged out', () => {
    cy.get('button').contains("Login");
});

// Scenario: Prevent registration with an invalid email format
//         Given The user is on the registration page "http://localhost:3000"
//         When The user enters an invalid email address
//         And Attempts to register
//         Then The user should see an error message: "Please enter a valid email address"

Given('The user is on the registration page {string}', (url) => {
    cy.visit(url);
    cy.get('button').contains("Sign up").click();
});

When('The user enters an invalid email address', () => {
    cy.get('#formEmailInput').type("invalid-email");
});

And('Attempts to register', () => {
    cy.get('button').contains("Register").click();
});

Then('The user should see an error message: {string}', (msg) => {
    cy.contains(msg).should("exist");
});

// Scenario: Prevent registration with an already used email
//         Given The user is on the registration page "http://localhost:3000"
//         And The email entered is already in use
//         When The user attempts to register
//         Then The user should see an error message: "Email already in use"

Given('The user is on the registration page {string}', (url) => {
    cy.visit(url);
    cy.get('button').contains("Sign up").click();
});

Given('The email entered is already in use', () => {
    cy.get('#formEmailInput').type(testUserForLogin.email);
    cy.get('#formPasswordInput').type(testUserForLogin.password);
    cy.get('#formDisplayNameInput').type("DuplicateUser");
});

When('The user attempts to register', () => {
    cy.get('button').contains("Register").click();
});

Then('The user should see an error message: {string}', (msg) => {
    cy.contains(msg).should("exist");
});

// Scenario Outline: Prevent registration when a required field is missing
//         Given The user is on the registration page "http://localhost:3000"
//         When The user leaves the "<Field>" field empty and attempts to register
//         Then The user should see an error message: "<ErrorMessage>"

//         Examples:
//             | Field        | ErrorMessage              |
//             | Email        | Email address is required |
//             | Password     | Password is required      |
//             | Display Name | Display name is required  |

Given('The user is on the registration page {string}', (url) => {
    cy.visit(url);
    cy.get('button').contains("Sign up").click();
});

When('The user leaves the {string} field empty and attempts to register', (field) => {
    const values = {
        email: 'test@example.com',
        password: 'Password123!',
        displayName: 'TestUser'
    };

    // Clear the specific field and fill the rest
    if (field !== 'Email') {
        cy.get('#formEmailInput').type(values.email);
    }

    if (field !== 'Password') {
        cy.get('#formPasswordInput').type(values.password);
    }

    if (field !== 'Display Name') {
        cy.get('#formDisplayNameInput').type(values.displayName);
    }

    cy.get('button').contains("Register").click();
});

Then('The user should see an error message: {string}', (errorMsg) => {
    cy.contains(errorMsg).should('exist');
});

// Scenario: Prevent login with incorrect credentials
//         Given The user is on the login page "http://localhost:3000"
//         When The user enters incorrect email or password
//         And Attempts to log in
//         Then The user should see an error message: "Invalid email or password"

Given('The user is on the login page {string}', (url) => {
    cy.visit(url);
    cy.get('button').contains("Log in").click();
});

When('The user enters incorrect email or password', () => {
    cy.get('#formEmailInput').type("wrong@example.com");
    cy.get('#formPasswordInput').type("WrongPass123");
});

And('Attempts to log in', () => {
    cy.get('button').contains("Login").click();
});

Then('The user should see an error message: {string}', (msg) => {
    cy.contains(msg).should("exist");
});

// Scenario: Secure Login Input
//         Given The user is on the login page "http://localhost:3000"
//         When The user enters their email and password
//         Then The system should sanitize both inputs to prevent NoSQL Injection

Given('The user is on the login page {string}', (url) => {
    cy.visit(url);
    cy.get('button').contains("Log in").click();
});

When('The user enters their email and password', () => {
    cy.get('#formEmailInput').type("wrong@example.com");
    cy.get('#formPasswordInput').type('{"$ne": null}', { parseSpecialCharSequences: false });
    cy.get('button').contains("Login").click();
});

Then('The system should sanitize both inputs to prevent NoSQL Injection', () => {
    cy.contains("Invalid email or password").should("exist");
});

Cypress.Commands.add("login", (email, password) => {
    cy.visit("http://localhost:3000");
    cy.get('button').contains("Log in").click();
    cy.get("#formEmailInput").type(email);
    cy.get("#formPasswordInput").type(password);
    cy.contains("Login").click();
});
