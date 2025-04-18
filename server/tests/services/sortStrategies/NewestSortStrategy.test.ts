import { NewestSortStrategy } from "../../../services/sortStrategies/NewestSortStrategy";
import Question from "../../../models/questions";
import { IQuestion } from "../../../types/types";

// Mock the Question model
jest.mock("../../../models/questions");

describe("NewestSortStrategy", () => {
    const mockQuestions: IQuestion[] = [
        {
            _id: "1",
            title: "How to use useEffect in React?",
            text: "I'm confused with useEffect dependency array.",
            tags: [{ name: "react" }],
            answers: [],
            asked_by: "user1",
            ask_date_time: new Date().toISOString(),
            views: 8,
            vote_score: 4
        },
        {
            _id: "2",
            title: "Setting up TypeScript in Node.js",
            text: "Need help configuring TS.",
            tags: [{ name: "typescript" }],
            answers: [],
            asked_by: "user2",
            ask_date_time: new Date().toISOString(),
            views: 15,
            vote_score: 2
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return newest questions using getNewestQuestions()", async () => {
        (Question.getNewestQuestions as jest.Mock).mockResolvedValue(mockQuestions);

        const strategy = new NewestSortStrategy();
        const result = await strategy.sort();

        expect(Question.getNewestQuestions).toHaveBeenCalled();
        expect(result).toEqual(mockQuestions);
    });
});
