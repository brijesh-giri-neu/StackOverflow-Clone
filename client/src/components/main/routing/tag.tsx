import React from "react";
import PageClass, { PageClassProps } from ".";
import TagPage from "../tagPage/tagPageView";
import { SetTagPageFunctionType } from "../../../types/functionTypes";

/**
 * Extended props including setTagPage specifically for TagPageClass
 */
interface TagPageClassProps extends PageClassProps {
  setTagPage: SetTagPageFunctionType
}

/**
 * TagPageClass is a class that extends PageClass and returns the TagPage component.
 */
export default class TagPageClass extends PageClass {
  // Extend PageClass by adding more properties
  setTagPage: SetTagPageFunctionType

  constructor(props: TagPageClassProps) {
    super(props);
    this.setTagPage = props.setTagPage;
  }

  getContent(): React.ReactNode {
    return (
      <TagPage
        clickTag={this.clickTag}
        handleNewQuestion={this.handleNewQuestion}
        page={this.page ?? 1}
        limit={this.limit ?? 20}
        setTagPage={this.setTagPage}
        userId={this.user?._id}
      />
    );
  }

  getSelected(): string {
    return "t";
  }
}
