import { IQuestion } from "../types/types";
import { NewestSortStrategy } from "./sortStrategies/NewestSortStrategy";
import { ActiveSortStrategy } from "./sortStrategies/ActiveSortStrategy";
import { UnansweredSortStrategy } from "./sortStrategies/UnansweredSortStrategy";
import { ISortStrategy } from "./sortStrategies/ISortStrategy";

/**
 * Context function that sorts questions based on the specified order type.
 * This function uses the Strategy design pattern to select the appropriate sorting strategy.
 * 
 * @param {string} order The sorting order (e.g., "newest", "active", "unanswered").
 * @returns {Promise<IQuestion[]>} A promise of a sorted list of questions based on the specified order.
 */
export async function sortQuestions(order: string): Promise<IQuestion[]> {
    const strategy = getSortStrategy(order);
    return strategy.sort();
}

/**
 * Returns the sorting strategy class based on the provided order type.
 * This function maps the order type to the appropriate strategy class.
 * 
 * @param {string} order The sorting order (e.g., "newest", "active", "unanswered").
 * @returns {ISortStrategy} The sorting strategy class corresponding to the provided order type.
 */
function getSortStrategy(order: string): ISortStrategy {
    const strategies: Record<string, ISortStrategy> = {
        newest: new NewestSortStrategy(),
        active: new ActiveSortStrategy(),
        unanswered: new UnansweredSortStrategy(),
    };

    // Default to 'newest' strategy if the order is unrecognized
    return strategies[order] || new NewestSortStrategy();
}
