import { useState } from "react";
import HomePageClass from "../components/main/routing/home";
import TagPageClass from "../components/main/routing/tag";
import AnswerPageClass from "../components/main/routing/answer";
import NewQuestionPageClass from "../components/main/routing/newQuestion";
import NewAnswerPageClass from "../components/main/routing/newAnswer";
import UserRegistrationPageClass from "../components/main/routing/userRegistration";
import UserLoginPageClass from "../components/main/routing/userLogin";
import UserProfilePageClass from "../components/main/routing/userProfile";
import EditUserProfilePageClass from "../components/main/routing/editUserProfile";
import { UserResponseType, UserProfileType } from "../types/entityTypes";
import { PageSetterFunctionType } from "../types/functionTypes";
import { FakeStackOverflowProps } from "../types/propTypes";

/**
 * Custom hook that manages the core application state and page navigation logic
 * for the Fake Stack Overflow app.
 *
 * This hook centralizes:
 * - Search, title, and question sort state
 * - User session and profile state
 * - Navigation handlers for all page views (e.g. Home, Tags, Question, Answer)
 *
 * It constructs and updates `PageClass` instances that render appropriate views
 * and wire them with shared handlers and props.
 *
 * @returns {object} An object containing application state, user session data, current page, and page switching handlers
 */
export const useFakeStackOverflow = () : FakeStackOverflowProps => {
    // Core global state
    const [search, setSearch] = useState("");
    const [mainTitle, setMainTitle] = useState("All Questions");
    const [questionOrder, setQuestionOrder] = useState("newest");
    const [qid, setQid] = useState("");
    const [user, setUser] = useState<UserResponseType | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

    /**
     * Navigates to the user registration page.
     */
    const setUserRegistrationPage = () => {
        setPageInstance(
            new UserRegistrationPageClass(getCommonProps("User Registration"))
        );
    };

    /**
     * Navigates to the user login page.
     */
    const setUserLoginPage = () => {
        setPageInstance(new UserLoginPageClass(getCommonProps("User Login")));
    };

    /**
     * Logs out the current user and navigates back to login page.
     */
    const handleUserLogout = () => {
        setUser(null);
        setUserProfile(null);
        setUserLoginPage();
    };

    /**
     * Navigates to the edit profile page.
     */
    const setEditUserProfilePage = () => {
        setPageInstance(new EditUserProfilePageClass(getCommonProps("Edit Profile")));
    };

    /**
     * Navigates to the user profile page and updates profile state.
     * @param updatedProfile - The updated user profile to set before navigation
     */
    const setProfilePage = (updatedProfile: UserProfileType) => {
        setUserProfile(updatedProfile);
        setPageInstance(new UserProfilePageClass(getCommonProps("User Profile")));
    };

    /**
     * Navigates to the question listing page based on search and sort criteria.
     * @param search - Optional search filter string
     * @param title - Optional title of the page to display
     * @param page - Pagination page number
     * @param limit - Pagination page size
     */
    const setQuestionPage: PageSetterFunctionType = (
        search = "",
        title = "All Questions",
        page = 1,
        limit = 10
    ) => {
        setSearch(search);
        setMainTitle(title);
        setPageInstance(
            new HomePageClass({
                ...getCommonProps(title),
                search,
                title,
                page,
                limit,
            })
        );
    };

    /**
     * Navigates to the tag statistics page.
     * @param page - Optional pagination page number
     * @param limit - Optional pagination limit
     */
    const setTagPage = (page = 1, limit = 20) => {
        setPageInstance(
            new TagPageClass({
                ...getCommonProps(mainTitle),
                page,
                limit,
                setTagPage,
            })
        );
    };

    /**
     * Resets search and navigates to the default questions listing page.
     */
    const handleQuestions = () => {
        setSearch("");
        setMainTitle("All Questions");
        setPageInstance(new HomePageClass(getCommonProps("All Questions")));
    };

    /**
     * Navigates to the tag list page.
     */
    const handleTags = () => {
        setPageInstance(new TagPageClass({ ...getCommonProps(mainTitle), setTagPage }));
    };

    /**
     * Navigates to the answer page for a given question.
     * @param questionId - ID of the question to view answers for
     */
    const handleAnswer = (questionId: string) => {
        setQid(questionId);
        setPageInstance(new AnswerPageClass(getCommonProps(mainTitle)));
    };

    /**
     * Filters questions by tag and navigates to filtered results page.
     * @param tag - Tag name to filter questions
     */
    const clickTag = (tag: string) => {
        const formattedTag = `[${tag}]`;
        setSearch(formattedTag);
        setMainTitle(tag);
        setPageInstance(new HomePageClass(getCommonProps(tag)));
    };

    /**
     * Navigates to the new question creation form.
     */
    const handleNewQuestion = () => {
        setPageInstance(new NewQuestionPageClass(getCommonProps(mainTitle)));
    };

    /**
     * Navigates to the new answer submission form.
     */
    const handleNewAnswer = () => {
        setPageInstance(new NewAnswerPageClass(getCommonProps(mainTitle)));
    };

    /**
    * Updates shared mutable properties of the currently active page instance
    * with values from global state.
    */
    const updateInstanceProps = () => {
        pageInstance.search = search;
        pageInstance.questionOrder = questionOrder;
        pageInstance.qid = qid;
        pageInstance.title = mainTitle;
        pageInstance.user = user;
        pageInstance.userProfile = userProfile;
    };

    /**
     * Constructs the common props object shared by all page class instances.
     * @param title - The title to use for the new page instance
     * @returns PageClassProps
     */
    const getCommonProps = (title: string) => ({
        search,
        title,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
        setUserRegistrationPage,
        setUserLoginPage,
        handleUserLogout,
        setEditUserProfilePage,
        userProfile,
        setProfilePage,
        user,
        setUser,
        setUserProfile,
        
    });

    // Initial page instance state
    const [pageInstance, setPageInstance] = useState(
        new HomePageClass({
            search: "",
            title: "All Questions",
            setQuestionPage,
            questionOrder,
            setQuestionOrder,
            qid,
            handleQuestions,
            handleTags,
            handleAnswer,
            clickTag,
            handleNewQuestion,
            handleNewAnswer,
            setUserRegistrationPage,
            setUserLoginPage,
            handleUserLogout,
            setEditUserProfilePage,
            userProfile,
            setProfilePage,
            user,
            setUser,
            setUserProfile,
        })
    );

    // Apply global state updates to the active page instance
    updateInstanceProps();

    return {
        search,
        user,
        userProfile,
        pageInstance,
        setQuestionPage,
        setUserRegistrationPage,
        setUserLoginPage,
        handleUserLogout,
        setEditUserProfilePage,
        setProfilePage,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
        setUser,
        setUserProfile,
    };
};
