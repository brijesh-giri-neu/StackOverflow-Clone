import { sortQuestions } from "../../services/questionSortService";
import { NewestSortStrategy } from "../../services/sortStrategies/NewestSortStrategy";
import { ActiveSortStrategy } from "../../services/sortStrategies/ActiveSortStrategy";
import { UnansweredSortStrategy } from "../../services/sortStrategies/UnansweredSortStrategy";

jest.mock("../../services/sortStrategies/NewestSortStrategy");
jest.mock("../../services/sortStrategies/ActiveSortStrategy");
jest.mock("../../services/sortStrategies/UnansweredSortStrategy");

describe("sortQuestions", () => {
    it("should use NewestSortStrategy when order is 'newest'", async () => {
        const mockSort = jest.fn().mockResolvedValue(["newest-question"]);
        (NewestSortStrategy as jest.Mock).mockImplementation(() => ({
            sort: mockSort
        }));

        const result = await sortQuestions("newest");
        expect(mockSort).toHaveBeenCalled();
        expect(result).toEqual(["newest-question"]);
    });

    it("should use ActiveSortStrategy when order is 'active'", async () => {
        const mockSort = jest.fn().mockResolvedValue(["active-question"]);
        (ActiveSortStrategy as jest.Mock).mockImplementation(() => ({
            sort: mockSort
        }));

        const result = await sortQuestions("active");
        expect(mockSort).toHaveBeenCalled();
        expect(result).toEqual(["active-question"]);
    });

    it("should use UnansweredSortStrategy when order is 'unanswered'", async () => {
        const mockSort = jest.fn().mockResolvedValue(["unanswered-question"]);
        (UnansweredSortStrategy as jest.Mock).mockImplementation(() => ({
            sort: mockSort
        }));

        const result = await sortQuestions("unanswered");
        expect(mockSort).toHaveBeenCalled();
        expect(result).toEqual(["unanswered-question"]);
    });

    it("should default to NewestSortStrategy for unknown order", async () => {
        const mockSort = jest.fn().mockResolvedValue(["default-newest"]);
        (NewestSortStrategy as jest.Mock).mockImplementation(() => ({
            sort: mockSort
        }));

        const result = await sortQuestions("unknown-order");
        expect(mockSort).toHaveBeenCalled();
        expect(result).toEqual(["default-newest"]);
    });
});
