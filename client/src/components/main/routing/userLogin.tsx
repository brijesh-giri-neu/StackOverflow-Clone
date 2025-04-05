import React from "react";
import PageClass from ".";
import UserLogin from "../userLogin/userLoginView";

/**
 * Class for the User Login Page
 * The User Login Page allows the user to log in to their account
 */
export default class UserLoginPageClass extends PageClass {
    getContent(): React.ReactNode {
        return <UserLogin setUser={this.setUser} handleQuestions={this.handleQuestions} />;
    }

    getSelected(): string {
        return "user-login";  // You can change this to reflect the current selection in the app
    }
}