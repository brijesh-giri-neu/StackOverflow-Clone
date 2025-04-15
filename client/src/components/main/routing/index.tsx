import {
  PageSetterFunctionType,
  ClickTagFunctionType,
  IdFunctionType,
  VoidFunctionType,
  OrderFunctionType,
  UserObjFunctionType,
  UserProfileObjFunctionType
} from "../../../types/functionTypes";
import { UserProfileType, UserResponseType } from "../../../types/entityTypes";

// The type definitions for the input object of the PageClass constructor
export interface PageClassProps {
  search: string;
  title: string;
  setQuestionPage: PageSetterFunctionType;
  questionOrder: string;
  setQuestionOrder: OrderFunctionType;
  qid: string;
  handleQuestions: VoidFunctionType;
  handleTags: VoidFunctionType;
  handleAnswer: IdFunctionType;
  clickTag: ClickTagFunctionType;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
  setUserRegistrationPage: VoidFunctionType;
  setUserLoginPage: VoidFunctionType;
  handleUserLogout: VoidFunctionType;
  setEditUserProfilePage: VoidFunctionType;
  userProfile: UserProfileType | null;
  setProfilePage: UserProfileObjFunctionType;
  user: UserResponseType | null;
  setUser: UserObjFunctionType;
  setUserProfile: UserProfileObjFunctionType;
  // Optional pagination props
  page?: number;
  limit?: number;
}

/**
 * The base class for all pages that will be rendered in Main component.
 * This class is extended by all other page classes.
 * 
 * All child classes must implement the getContent() method.
 * Pages that need to control the selected tab must implement the getSelected() method.
 * 
 */
class PageClass {
  search: string; // The search query string
  title: string;  // The title of the page
  setQuestionPage: PageSetterFunctionType; // The function to set current page with list of questions based on a filter
  questionOrder: string;  // the order of the questions
  setQuestionOrder: OrderFunctionType;  // the function to set the order of the questions
  qid: string;  // the id of a question
  
  handleQuestions: VoidFunctionType;  // the function to render the list of questions
  handleTags: VoidFunctionType; // the function to render the list of tags
  handleAnswer: IdFunctionType; // the function to render the answers page of a question
  clickTag: ClickTagFunctionType; // the function to handle the click event on a tag
  handleNewQuestion: VoidFunctionType;  // the function to handle the creation of a new question
  handleNewAnswer: VoidFunctionType;  // the function to handle the creation of a new answer
  setUserRegistrationPage: VoidFunctionType;
  setUserLoginPage: VoidFunctionType;
  handleUserLogout: VoidFunctionType;
  setEditUserProfilePage: VoidFunctionType;
  userProfile: UserProfileType | null;
  setProfilePage: UserProfileObjFunctionType;
  user: UserResponseType | null;
  setUser: UserObjFunctionType;
  setUserProfile: UserProfileObjFunctionType;
  // Optional pagination properties
  page?: number;
  limit?: number;

  constructor(props: PageClassProps) {
    this.search = props.search;
    this.title = props.title;
    this.setQuestionPage = props.setQuestionPage;
    this.questionOrder = props.questionOrder;
    this.setQuestionOrder = props.setQuestionOrder;
    this.qid = props.qid;
    this.handleQuestions = props.handleQuestions;
    this.handleTags = props.handleTags;
    this.handleAnswer = props.handleAnswer;
    this.clickTag = props.clickTag;
    this.handleNewQuestion = props.handleNewQuestion;
    this.handleNewAnswer = props.handleNewAnswer;
    this.setUserRegistrationPage = props.setUserRegistrationPage;
    this.setUserLoginPage = props.setUserLoginPage;
    this.handleUserLogout = props.handleUserLogout;
    this.setEditUserProfilePage = props.setEditUserProfilePage;
    this.userProfile = props.userProfile;
    this.setProfilePage = props.setProfilePage;
    this.user = props.user;
    this.setUser = props.setUser;
    this.setUserProfile = props.setUserProfile;
    // Optional pagination props
    this.page = props.page;
    this.limit = props.limit;
  }

  getContent(): React.ReactNode {
    return null;
  }

  getSelected(): string {
    return "";
  }
}

export default PageClass;
