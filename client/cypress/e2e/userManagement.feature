Feature: User Account Management
    As a user of the platform
    I want to manage my account through registration, login, profile updates, and account deletion
    So that I can securely participate and maintain control over my identity and data

    Scenario: User successfully registers a new account
        Given The user is on the registration page
        When The user enters a valid email, password, and display name
        And Submits the registration form
        Then The user should see a registration confirmation
        And Be logged into their new account
        And Be redirected to the questions page

    Scenario: User logs in with valid credentials
        Given The user is on the login page
        When The user enters a valid email and password
        Then The user should be redirected to the questions page

    Scenario: User logs out successfully
        Given The user is logged in and is on any page of the application
        When The user chooses to log out
        Then The user should be redirected to the login page
        And See a message indicating successful logout

    Scenario: User updates their profile information
        Given The user is logged in and on the profile settings page
        When The user updates one or more of the following fields:
            | Display Name |
            | Location     |
            | Title        |
            | About Me     |
            | Full Name    |
            | Website Link |
            | X Link       |
            | GitHub Link  |
        Then The system should save the changes
        And Reflect them on the user's public profile

    Scenario: User deletes their account
        Given The user is logged in and on the profile settings page
        When The user initiates the account deletion process
        And Confirms the deletion
        Then The account should be deactivated
        And The user should be logged out

    Scenario: Prevent registration with an invalid email format
        Given The user is on the registration page
        When The user enters an invalid email address
        And Attempts to register
        Then The user should see an error message: "Please enter a valid email address"

    Scenario: Prevent registration with an already used email
        Given The user is on the registration page
        And The email entered is already in use
        When The user attempts to register
        Then The user should see an error message: "Email already in use"

    Scenario: Prevent registration with missing required fields
        Given The user is on the registration page
        When The user attempts to register without filling in all required fields
        Then The user should see an error message: "All fields are required"

    Scenario: Prevent login with incorrect credentials
        Given The user is on the login page
        When The user enters incorrect email or password
        And Attempts to log in
        Then The user should see an error message: "Invalid email or password"

    Scenario: Secure Login Input
        Given The user is on the login page
        When The user enters their email and password
        Then The system should sanitize both inputs to prevent NoSQL Injection
