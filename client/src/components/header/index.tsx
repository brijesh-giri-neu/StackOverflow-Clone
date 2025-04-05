import "./index.css";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { QuestionsPageQueryFuntionType, VoidFunctionType } from "../../types/functionTypes";
import { UserResponseType } from "../../types/entityTypes";

interface HeaderProps {
  user: UserResponseType | null;
  search: string;
  setQuestionPage: QuestionsPageQueryFuntionType;
  setUserRegistrationPage: VoidFunctionType;
  setUserLoginPage: VoidFunctionType;
  setProfilePage: VoidFunctionType;
  handleQuestions: VoidFunctionType;
}

/**
 * A Stack Overflow–style header with a logo on the left,
 * a search bar in the center, and a profile or auth buttons on the right.
 */
const Header = ({
  user,
  search,
  setQuestionPage,
  setUserRegistrationPage,
  setUserLoginPage,
  setProfilePage,
  handleQuestions
}: HeaderProps) => {
  const [val, setVal] = useState<string>(search);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

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
          className="header-search"
          placeholder="Search ..."
          type="text"
          value={val}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="header-right">
        {user ? (
          <img
            src="/profile.png"
            alt="Profile"
            className="profile-icon"
            onClick={setProfilePage}
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
