import { IQuestion } from "../../types/types";
import Question from "../../models/questions";
import { ISortStrategy } from "./ISortStrategy";

/**
 * Strategy for sorting questions by newest first.
 * 
 * This class implements the ISortStrategy interface and provides the logic for sorting questions by the newest ones first.
 */
export class NewestSortStrategy implements ISortStrategy {
    /**
     * Sorts the questions by the newest first.
     * 
     * @returns {Promise<IQuestion[]>} A promise of the newest questions.
     */
    async sort(): Promise<IQuestion[]> {
        return Question.getNewestQuestions();
    }
}
