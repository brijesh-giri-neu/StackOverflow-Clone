import { useEffect, useState } from "react";
import Header from "./header";
import Main from "./main/mainView";
import HomePageClass from "./main/routing/home";
import TagPageClass from "./main/routing/tag";
import AnswerPageClass from "./main/routing/answer";
import NewQuestionPageClass from "./main/routing/newQuestion";
import NewAnswerPageClass from "./main/routing/newAnswer";
import UserRegistrationPageClass from "./main/routing/userRegistration";
import UserLoginPageClass from "./main/routing/userLogin";
import UserProfilePageClass from "./main/routing/userProfile";
import EditUserProfilePageClass from "./main/routing/editUserProfile";
import { UserProfileType, UserResponseType } from "../types/entityTypes";

/**
 * The root component for the Fake Stack Overflow application.
 * 
 * It is composed of a Header and a Main component.
 * 
 * It uses the following state variables:
 * - search: the search string
 * - mainTitle: the title of the main page
 * - questionOrder: the order of the questions
 * - qid: the question id
 * - pageInstance: the current page object rendered in the Main component
 * 
 * It defines functions to set the page the user has requested to see.
 * @returns the Fake Stack Overflow component
 */

const FakeStackOverflow = () => {
  const [search, setSearch] = useState<string>("");
  const [mainTitle, setMainTitle] = useState<string>("All Questions");
  const [questionOrder, setQuestionOrder] = useState("newest");
  const [qid, setQid] = useState("");
  const [user, setUser] = useState<UserResponseType | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

  useEffect(() => {
    console.log("Updated user state ->", user);
    console.log("Updated user profile ->", userProfile);
  }, [user]);

  // Set the page to display the user registration form
  const setUserRegistrationPage = () => {
    setPageInstance(
      new UserRegistrationPageClass({
        search,
        title: "User Registration",
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
  };

  const setUserLoginPage = () => {
    setPageInstance(
      new UserLoginPageClass({
        search,
        title: "User Login",
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
  };

  const handleUserLogout = () => {
    setUser(null);
    setUserProfile(null);
    handleQuestions();
  };

  const setEditUserProfilePage = () => {
    setPageInstance(
      new EditUserProfilePageClass({
        search,
        title: "User Login",
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
  };


  // const setProfilePage = () => {
  //   setPageInstance(
  //     new UserProfilePageClass({
  //       search,
  //       title: "User Login",
  //       setQuestionPage,
  //       questionOrder,
  //       setQuestionOrder,
  //       qid,
  //       handleQuestions,
  //       handleTags,
  //       handleAnswer,
  //       clickTag,
  //       handleNewQuestion,
  //       handleNewAnswer,
  //       setUserRegistrationPage,
  //       setUserLoginPage,
  //       handleUserLogout,
  //       setEditUserProfilePage,
  //       userProfile,
  //       setProfilePage: setProfilePage,
  //       user,
  //       setUser,
  //       setUserProfile,
  //     })
  //   );
  // };

  const setProfilePage = (userProileUpdated: UserProfileType) => {
    //console.log("userProileUpdated ->"+userProileUpdated);
    setUserProfile(userProileUpdated);
    setPageInstance(
      new UserProfilePageClass({
        search,
        title: "User Login",
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
  };


  // Set the page to display the questions based on the search string
  const setQuestionPage = (
    search = "",
    title = "All Questions"
  ): void => {
    setSearch(search);
    setMainTitle(title);
    setPageInstance(
      new HomePageClass({
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
      })
    );
  };

  // Set the page to display all questions
  const handleQuestions = () => {
    setSearch("");
    setMainTitle("All Questions");
    setPageInstance(
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
  };

  // Set the page to display the tags
  const handleTags = () => {
    setPageInstance(
      new TagPageClass({
        search,
        title: mainTitle,
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
  };

  // Set the page to display the answers to a question
  const handleAnswer = (qid: string) => {
    setQid(qid);
    setPageInstance(
      new AnswerPageClass({
        search,
        title: mainTitle,
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
  };

  // Set the page to display the questions based on the selected tag name
  const clickTag = (tname: string) => {
    setSearch("[" + tname + "]");
    setMainTitle(tname);
    setPageInstance(
      new HomePageClass({
        search: "[" + tname + "]",
        title: tname,
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
  };

  // Set the page to display the form to create a new question
  const handleNewQuestion = () => {
    setPageInstance(
      new NewQuestionPageClass({
        search,
        title: mainTitle,
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
  };

  // Set the page to display the form to create a new answer
  const handleNewAnswer = () => {
    setPageInstance(
      new NewAnswerPageClass({
        search,
        title: mainTitle,
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
  };

  // The current page object used to render the Main component
  const [pageInstance, setPageInstance] = useState(new HomePageClass({
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

  /**
   * set relevant properties in the pageInstance object 
   * to be used when rendering the relevant component in Main.
   * This is bad practice as mutating the object directly is not recommended.
   * Must be refactored at some point.
   */
  pageInstance.search = search;
  pageInstance.questionOrder = questionOrder;
  pageInstance.qid = qid;
  pageInstance.title = mainTitle;
  pageInstance.userProfile = userProfile;

  return (
    <>
      <Header
        user={user}
        userProfile={userProfile}
        search={search}
        setQuestionPage={setQuestionPage}
        setUserRegistrationPage={setUserRegistrationPage}
        setUserLoginPage={setUserLoginPage}
        setProfilePage={setProfilePage} 
        handleQuestions={handleQuestions}/>
      <Main
        page={pageInstance}
        handleQuestions={handleQuestions} handleTags={handleTags}
      />
    </>
  );
};

export default FakeStackOverflow;
