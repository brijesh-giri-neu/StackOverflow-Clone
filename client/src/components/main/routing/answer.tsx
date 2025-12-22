import React from "react";
import PageClass, { PageClassProps } from ".";
import AnswerPage from "../answerPage/answerPageView";
import { VoidFunctionType } from "../../../types/functionTypes";
import { UserResponseType } from "../../../types/entityTypes";

// The type definition for the constructor parameter.
interface AnswerPageClassProps
  extends Omit<PageClassProps, "handleNewQuestion" | "handleNewAnswer"> {
  user: UserResponseType | null;
  qid: string;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
}

/**
 * The class represents the answer page for a question.
 */
export default class AnswerPageClass extends PageClass {
  user: UserResponseType | null;
  qid: string;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;

  /**
   * The constructor for the class set the question id, 
   * and the functions to render newly created questions and answers.
   * @param props The properties of the class.
   */
  constructor(props: AnswerPageClassProps) {
    super({
      search: props.search,
      title: props.title,
      setQuestionPage: props.setQuestionPage,
      questionOrder: props.questionOrder,
      setQuestionOrder: props.setQuestionOrder,
      qid: props.qid,
      handleQuestions: props.handleQuestions,
      handleTags: props.handleTags,
      handleAnswer: props.handleAnswer,
      clickTag: props.clickTag,
      handleNewQuestion: props.handleNewQuestion,
      handleNewAnswer: props.handleNewAnswer,
      setUserRegistrationPage: props.setUserRegistrationPage,
      setUserLoginPage: props.setUserLoginPage,
      handleUserLogout: props.handleUserLogout,
      setEditUserProfilePage: props.setEditUserProfilePage,
      userProfile: props.userProfile,
      setProfilePage: props.setProfilePage,
      user: props.user,
      setUser: props.setUser,
      setUserProfile: props.setUserProfile,
    });

    this.qid = props.qid;
    this.user = props.user;
    this.handleNewQuestion = props.handleNewQuestion;
    this.handleNewAnswer = props.handleNewAnswer;
  }

  getContent(): React.ReactNode {
    return (
      <AnswerPage
        userId={this.user?._id}
        qid={this.qid}
        handleNewQuestion={this.handleNewQuestion}
        handleNewAnswer={this.handleNewAnswer}
        clickTag={this.clickTag}
      />
    );
  }

  getSelected(): string {
    return "";
  }
}
