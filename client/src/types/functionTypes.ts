/**
 * This file contains all the function types used in the application.
 * Function types are used to define the functions that are passed as props to components.
 */

import { UserProfileType, UserResponseType } from "./entityTypes";

type VoidFunctionType = () => void;

type PageSetterFunctionType = (search?: string, title?: string) => void;

type QuestionsPageQueryFuntionType = (query: string, title: string) => void;

type ClickTagFunctionType = (tagName: string) => void;

type IdFunctionType = (id: string) => void;

type OrderFunctionType = (order: string) => void;

type MessageFunctionType = (message: string) => void;

type QuestionIdFunctionType = (qid: string) => void;

type StringFunctionType = (value: string) => void;

type UserIdFunctionType = (userid: string) => void;

type UserObjFunctionType = (user: UserResponseType) => void;

type UserProfileObjFunctionType = (userProfile: UserProfileType) => void;

type SetQuestionPageFunctionType = (search: string, title: string, page: number, limit: number) => void;

type SetTagPageFunctionType = (page: number, limit: number) => void;

export type {
  VoidFunctionType,
  PageSetterFunctionType,
  ClickTagFunctionType,
  IdFunctionType,
  OrderFunctionType,
  MessageFunctionType,
  QuestionIdFunctionType,
  StringFunctionType,
  QuestionsPageQueryFuntionType,
  UserIdFunctionType,
  UserObjFunctionType,
  UserProfileObjFunctionType,
  SetQuestionPageFunctionType,
  SetTagPageFunctionType
};
