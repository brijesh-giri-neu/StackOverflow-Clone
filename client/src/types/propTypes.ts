import { UserProfileType, UserResponseType } from "./entityTypes";
import { PageSetterFunctionType } from "./functionTypes";

/**
 * Props for the Pagination component.
 */
export interface PaginationProps {
  /**
   * The current active page number (1-based).
   */
  currentPage: number;

  /**
   * Total number of available pages.
   */
  totalPages: number;

  /**
   * Number of items per page.
   */
  pageSize: number;

  /**
   * Function to be called when changing pages.
   * @param page - The new page number to fetch.
   * @param pageSize - The number of items per page.
   */
  setPage: (page: number, pageSize: number) => void;
}


/**
 * Defines the structure of props returned by the `useFakeStackOverflow` hook
 * and used across the Fake Stack Overflow application for managing state,
 * navigation, and session data.
 */
export interface FakeStackOverflowProps {
  /** Current search query string */
  search: string;

  /** Currently authenticated user, or null if not logged in */
  user: UserResponseType | null;

  /** Extended user profile associated with the current user, or null */
  userProfile: UserProfileType | null;

  /** The current page class instance used to render the main content view */
  pageInstance: any;

  /** Navigates to a question listing page with optional filters */
  setQuestionPage: PageSetterFunctionType;

  /** Navigates to the user registration page */
  setUserRegistrationPage: () => void;

  /** Navigates to the login page */
  setUserLoginPage: () => void;

  /** Logs out the user and navigates to login page */
  handleUserLogout: () => void;

  /** Navigates to the edit profile page */
  setEditUserProfilePage: () => void;

  /** Navigates to the user profile page after updating profile */
  setProfilePage: (updatedProfile: UserProfileType) => void;

  /** Navigates to the default all-questions listing page */
  handleQuestions: () => void;

  /** Navigates to the tag listing/statistics page */
  handleTags: () => void;

  /** Navigates to the answer page for a specific question */
  handleAnswer: (questionId: string) => void;

  /** Navigates to the questions filtered by a given tag */
  clickTag: (tag: string) => void;

  /** Navigates to the new question creation form */
  handleNewQuestion: () => void;

  /** Navigates to the new answer submission form */
  handleNewAnswer: () => void;

  /** Setter for user object in global state */
  setUser: (user: UserResponseType | null) => void;

  /** Setter for user profile in global state */
  setUserProfile: (profile: UserProfileType | null) => void;
}
