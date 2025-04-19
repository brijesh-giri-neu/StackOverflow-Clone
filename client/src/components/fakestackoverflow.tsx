import { ToastContainer } from 'react-toastify';
import Header from "./header";
import Main from "./main/mainView";
import { useFakeStackOverflow } from "../hooks/useFakeStackOverflow";
import { useUserSession } from '../hooks/useUserSession';

/**
 * The root component for the Fake Stack Overflow application.
 *
 * This component ties together the layout and functionality of the app.
 * It initializes session state (user and userProfile), configures
 * navigation handlers via a central custom hook `useFakeStackOverflow`,
 * and renders the Header and Main content area based on the current page state.
 *
 * Key responsibilities:
 * - Maintain and inject global state (search, user, userProfile, etc.)
 * - Route between pages using page classes (via `pageInstance`)
 *
 * @component
 * @returns {JSX.Element} The rendered Fake Stack Overflow app layout.
 */
const FakeStackOverflow = (): JSX.Element => {
  const {
    search,
    user,
    userProfile,
    pageInstance,
    setUser,
    setUserProfile,
    setQuestionPage,
    setUserRegistrationPage,
    setUserLoginPage,
    setProfilePage,
    handleQuestions,
    handleTags,
  } = useFakeStackOverflow();

  // Initializes user and profile from session storage or API call
  useUserSession(setUser, setUserProfile);

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
        handleQuestions={handleQuestions}
      />
      <Main
        page={pageInstance}
        handleQuestions={handleQuestions}
        handleTags={handleTags}
      />
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={false}
        draggable={false}
      />
    </>
  );
};

export default FakeStackOverflow;