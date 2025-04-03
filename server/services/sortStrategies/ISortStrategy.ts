import { IQuestion } from "../../types/types";

/**
 * Interface for the sorting strategy.
 * Every sorting strategy class will implement this interface.
 * 
 * This interface ensures that all sorting strategies follow the same structure.
 */
export interface ISortStrategy {
    /**
     * Sorts questions based on a specific strategy.
     * 
     * @returns {Promise<IQuestion[]>} A promise of a sorted list of questions.
     */
    sort(): Promise<IQuestion[]>;
}
