import { IQuestion } from "../../types/types";
import Question from "../../models/questions";
import { ISortStrategy } from "./ISortStrategy";

/**
 * Strategy for sorting questions by most active first.
 * 
 * This class implements the ISortStrategy interface and provides the logic for sorting questions by the most active ones.
 */
export class ActiveSortStrategy implements ISortStrategy {
    /**
     * Sorts the questions by the most active first.
     * 
     * @returns {Promise<IQuestion[]>} A promise of the active questions.
     */
    async sort(): Promise<IQuestion[]> {
        return Question.getActiveQuestions();
    }
}
