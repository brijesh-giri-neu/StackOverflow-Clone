import "./index.css";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import {
  QuestionsPageQueryFuntionType,
  UserProfileObjFunctionType,
  VoidFunctionType
} from "../../types/functionTypes";
import { UserProfileType, UserResponseType } from "../../types/entityTypes";

/**
 * Props for the Header component.
 */
interface HeaderProps {
  /** Currently logged-in user, or null if not logged in */
  user: UserResponseType | null;
  /** Profile data for the logged-in user, or null */
  userProfile: UserProfileType | null;
  /** Current search input */
  search: string;
  /** Function to update the question page based on search input */
  setQuestionPage: QuestionsPageQueryFuntionType;
  /** Function to show the user registration page */
  setUserRegistrationPage: VoidFunctionType;
  /** Function to show the user login page */
  setUserLoginPage: VoidFunctionType;
  /** Function to navigate to the user's profile page */
  setProfilePage: UserProfileObjFunctionType;
  /** Function to fetch and display all questions */
  handleQuestions: VoidFunctionType;
}

/**
 * A Stack Overflow–style header with a logo on the left,
 * a search bar in the center, and a profile or auth buttons on the right.
 */
const Header = ({
  user,
  userProfile,
  search,
  setQuestionPage,
  setUserRegistrationPage,
  setUserLoginPage,
  setProfilePage,
  handleQuestions
}: HeaderProps) => {
  const [val, setVal] = useState<string>(search);

  /**
   * Handles changes in the search input field.
   * @param e Input change event
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  /**
   * Triggers search when Enter key is pressed.
   * @param e Keyboard event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuestionPage(e.currentTarget.value, "Search Results");
    }
  };

  return (
    <header className="header-container">
      <div className="header-left" onClick={handleQuestions} style={{ cursor: "pointer" }}>
        <img src="/logo.png" alt="Stack Overflow Logo" className="header-logo" />
      </div>
      <div className="header-center">
        <input
          id="searchBar"
          className="header-search"
          placeholder="Search ..."
          type="text"
          value={val}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="header-right">
        {user && userProfile ? (
          <img
            src="/profile.png"
            alt="Profile"
            className="profile-icon"
            onClick={() => setProfilePage(userProfile)}
          />
        ) : (
          <>
            <button className="login-button" onClick={setUserLoginPage}>
              Log in
            </button>
            <button className="signup-button" onClick={setUserRegistrationPage}>
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
