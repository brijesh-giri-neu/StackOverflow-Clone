Feature: User Account Management
    As a user of the platform
    I want to manage my account through registration, login, profile updates, and account deletion
    So that I can securely participate and maintain control over my identity and data
    
    Scenario: User successfully registers a new account
        Given The user is on the registration page "http://localhost:3000"
        When The user enters a valid email, password, and display name
        And Submits the registration form
        Then The user should see a registration confirmation
        And Be logged into their new account and redirected to the questions page

    Scenario: User logs in with valid credentials
        Given The user is on the login page "http://localhost:3000"
        When The user enters a valid email and password
        Then The user should be redirected to the questions page

    Scenario: User logs out successfully
        Given The user is logged in and is on any page of the application
        When The user chooses to log out
        Then The user should be redirected to the login page
        And See a message indicating successful logout

    Scenario Outline: User updates their profile information
        Given The user is logged in and on the profile settings page
        When The user updates the "<Field>" field
        Then The system should save the changes and reflect the updated "<Field>" on the user's public profile

        Examples:
            | Field        |
            | Display Name |
            | Location     |
            | Title        |
            | About Me     |
            | Website Link |
            | X Link       |
            | GitHub Link  |

    Scenario: User deletes their account
        Given The user is logged in and on the profile settings page
        When The user initiates the account deletion process
        And Confirms the deletion
        Then The account should be deactivated
        And The user should be logged out

    Scenario: Prevent registration with an invalid email format
        Given The user is on the registration page "http://localhost:3000"
        When The user enters an invalid email address
        And Attempts to register
        Then The user should see an error message: "Please enter a valid email address"

    Scenario: Prevent registration with an already used email
        Given The user is on the registration page "http://localhost:3000"
        And The email entered is already in use
        When The user attempts to register
        Then The user should see an error message: "Email already in use"

    Scenario Outline: Prevent registration when a required field is missing
        Given The user is on the registration page "http://localhost:3000"
        When The user leaves the "<Field>" field empty and attempts to register
        Then The user should see an error message: "<ErrorMessage>"

        Examples:
            | Field        | ErrorMessage              |
            | Email        | Email address is required |
            | Password     | Password is required      |
            | Display Name | Display name is required  |

    Scenario: Prevent login with incorrect credentials
        Given The user is on the login page "http://localhost:3000"
        When The user enters incorrect email or password
        And Attempts to log in
        Then The user should see an error message: "Invalid email or password"

    Scenario: Secure Login Input
        Given The user is on the login page "http://localhost:3000"
        When The user enters their email and password
        Then The system should sanitize both inputs to prevent NoSQL Injection
