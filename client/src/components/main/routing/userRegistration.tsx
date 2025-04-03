import React from "react";
import PageClass from ".";
import UserRegistration from "../userRegistration/userRegistrationView";

/**
 * Class for the User Registration Page
 * The User Registration Page allows the user to create a new account
 */
export default class UserRegistrationPageClass extends PageClass {
    getContent(): React.ReactNode {
        return <UserRegistration handleQuestions={this.handleQuestions} />;
    }

    getSelected(): string {
        return "user-registration";  // You can change this to reflect the current selection in the app
    }
}
