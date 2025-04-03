import { IQuestion } from "../../types/types";
import Question from "../../models/questions";
import { ISortStrategy } from "./ISortStrategy";

/**
 * Strategy for sorting questions by unanswered questions first.
 * 
 * This class implements the ISortStrategy interface and provides the logic for sorting questions by the unanswered ones first.
 */
export class UnansweredSortStrategy implements ISortStrategy {
    /**
     * Sorts the questions by unanswered questions first.
     * 
     * @returns {Promise<IQuestion[]>} A promise of unanswered questions.
     */
    async sort(): Promise<IQuestion[]> {
        return Question.getUnansweredQuestions();
    }
}
