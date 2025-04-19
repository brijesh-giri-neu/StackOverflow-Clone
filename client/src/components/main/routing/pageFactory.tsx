import HomePageClass from "./home";
import TagPageClass from "./tag";
import AnswerPageClass from "./answer";
import NewQuestionPageClass from "./newQuestion";
import NewAnswerPageClass from "./newAnswer";
import UserRegistrationPageClass from "./userRegistration";
import UserLoginPageClass from "./userLogin";
import UserProfilePageClass from "./userProfile";
import EditUserProfilePageClass from "./editUserProfile";
import { PageClassProps } from ".";
import { SetTagPageFunctionType } from "../../../types/functionTypes";

/**
 * Extended props including optional setTagPage specifically for TagPageClass
 */
export interface ExtendedPageClassProps extends PageClassProps {
    setTagPage?: SetTagPageFunctionType;
}

/**
 * Factory function that maps a page name to its corresponding page class instance.
 * @param pageName - The string identifier for the page (e.g., 'home', 'tag').
 * @param props - The props to be passed into the corresponding page class.
 * @returns The instantiated page class.
 */
export default function getPage(
    pageName: string,
    props: ExtendedPageClassProps
) {
    switch (pageName) {
        case "home":
            return new HomePageClass(props);
        case "tag":
            if (!props.setTagPage) {
                throw new Error("Missing setTagPage for TagPageClass");
            }
            return new TagPageClass(props as PageClassProps & { setTagPage: SetTagPageFunctionType });
        case "answer":
            return new AnswerPageClass(props);
        case "newQuestion":
            return new NewQuestionPageClass(props);
        case "newAnswer":
            return new NewAnswerPageClass(props);
        case "register":
            return new UserRegistrationPageClass(props);
        case "login":
            return new UserLoginPageClass(props);
        case "profile":
            return new UserProfilePageClass(props);
        case "editProfile":
            return new EditUserProfilePageClass(props);
        default:
            throw new Error(`Unknown page type: ${pageName}`);
    }
}
