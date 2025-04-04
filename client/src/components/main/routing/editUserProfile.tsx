import React from "react";
import PageClass from ".";
import EditProfile from "../editProfilePage/editProfilePageView";

/**
 * Class for the New Question Page
 * The New Question Page is a page where the user can create a new question
 */
export default class EditUserProfilePageClass extends PageClass {
    
    getContent(): React.ReactNode {
        return <EditProfile
            userProfile={this.userProfile}
            handleLogout={this.handleUserLogout}
            setProfilePage={this.setProfilePage}
        />;
    }

    getSelected(): string {
        return "";
    }
}
