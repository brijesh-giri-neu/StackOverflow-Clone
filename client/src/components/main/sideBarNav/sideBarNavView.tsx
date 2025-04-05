import "./sideBarNavView.css";
import { VoidFunctionType } from "../../../types/functionTypes";
import { FaQuestion, FaTags, FaSignOutAlt } from "react-icons/fa";

// Create icon components with the appropriate type
const QuestionIcon = FaQuestion as React.FC<React.SVGProps<SVGSVGElement>>;
const TagIcon = FaTags as React.FC<React.SVGProps<SVGSVGElement>>;
const LogoutIcon = FaSignOutAlt as React.FC<React.SVGProps<SVGSVGElement>>;

interface SideBarNavProps {
  selected?: string;
  handleQuestions: VoidFunctionType;
  handleTags: VoidFunctionType;
}

/**
 * The sidebar component is composed of two buttons, one for questions and one for tags.
 * The selected prop is used to determine which button is selected.
 * The handleQuestions and handleTags functions are used to handle the click events for the buttons.
 *
 * @param props contains the selected prop, handleQuestions function, and handleTags function 
 * @returns the Sidebar component
 */
const SideBarNav = ({
  selected = "",
  handleQuestions,
  handleTags,
}: SideBarNavProps) => {
  return (
    <div id="sideBarNav" className="sideBarNav">
      <div
        id="menu_question"
        className={`menu_button ${selected === "q" ? "menu_selected" : ""}`}
        onClick={() => handleQuestions()}
      >
        <QuestionIcon className="icon" />
        Questions
      </div>
      <div
        id="menu_tag"
        className={`menu_button ${selected === "t" ? "menu_selected" : ""}`}
        onClick={() => handleTags()}
      >
        <TagIcon className="icon" />
        Tags
      </div>
    </div>
  );
};

export default SideBarNav;
