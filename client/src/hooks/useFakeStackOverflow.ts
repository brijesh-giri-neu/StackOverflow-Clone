// hooks/useFakeStackOverflow.ts
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

export const useFakeStackOverflow = () => {
    const [search, setSearch] = useState("");
    const [mainTitle, setMainTitle] = useState("All Questions");
    const [questionOrder, setQuestionOrder] = useState("newest");
    const [qid, setQid] = useState("");
    const [user, setUser] = useState<UserResponseType | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

    const updateInstanceProps = () => {
        pageInstance.search = search;
        pageInstance.questionOrder = questionOrder;
        pageInstance.qid = qid;
        pageInstance.title = mainTitle;
        pageInstance.user = user;
        pageInstance.userProfile = userProfile;
    };

    const setUserRegistrationPage = () => {
        setPageInstance(
            new UserRegistrationPageClass(getCommonProps("User Registration"))
        );
    };

    const setUserLoginPage = () => {
        setPageInstance(new UserLoginPageClass(getCommonProps("User Login")));
    };

    const handleUserLogout = () => {
        setUser(null);
        setUserProfile(null);
        setUserLoginPage();
    };

    const setEditUserProfilePage = () => {
        setPageInstance(new EditUserProfilePageClass(getCommonProps("Edit Profile")));
    };

    const setProfilePage = (updatedProfile: UserProfileType) => {
        setUserProfile(updatedProfile);
        setPageInstance(new UserProfilePageClass(getCommonProps("User Profile")));
    };

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

    const handleQuestions = () => {
        setSearch("");
        setMainTitle("All Questions");
        setPageInstance(new HomePageClass(getCommonProps("All Questions")));
    };

    const handleTags = () => {
        setPageInstance(new TagPageClass({ ...getCommonProps(mainTitle), setTagPage }));
    };

    const handleAnswer = (questionId: string) => {
        setQid(questionId);
        setPageInstance(new AnswerPageClass(getCommonProps(mainTitle)));
    };

    const clickTag = (tag: string) => {
        const formattedTag = `[${tag}]`;
        setSearch(formattedTag);
        setMainTitle(tag);
        setPageInstance(new HomePageClass(getCommonProps(tag)));
    };

    const handleNewQuestion = () => {
        setPageInstance(new NewQuestionPageClass(getCommonProps(mainTitle)));
    };

    const handleNewAnswer = () => {
        setPageInstance(new NewAnswerPageClass(getCommonProps(mainTitle)));
    };

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