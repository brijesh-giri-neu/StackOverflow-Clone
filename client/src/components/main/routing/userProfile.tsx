import React from "react";
import PageClass from ".";
import MainProfile from "../profilePage/profilePageView";

/**
 * Class for the New Question Page
 * The New Question Page is a page where the user can create a new question
 */
export default class UserProfilePageClass extends PageClass {
    
    getContent(): React.ReactNode {
        return <MainProfile
            userProfile={this.userProfile}
            setEditUserProfilePage={this.setEditUserProfilePage}
            handleLogout={this.handleUserLogout}
        />;
    }

    getSelected(): string {
        return "";
    }
}
