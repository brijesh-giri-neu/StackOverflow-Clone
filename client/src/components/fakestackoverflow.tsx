import { ToastContainer } from 'react-toastify';
import Header from "./header";
import Main from "./main/mainView";
import { useFakeStackOverflow } from "../hooks/useFakeStackOverflow";
import { useUserSession } from '../hooks/useUserSession';

const FakeStackOverflow = () => {
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

