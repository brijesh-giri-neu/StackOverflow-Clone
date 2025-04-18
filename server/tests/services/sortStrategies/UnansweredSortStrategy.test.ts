import { UnansweredSortStrategy } from "../../../services/sortStrategies/UnansweredSortStrategy";
import Question from "../../../models/questions";
import { IQuestion } from "../../../types/types";

// Mock the Question model
jest.mock("../../../models/questions");

describe("UnansweredSortStrategy", () => {
    const mockQuestions: IQuestion[] = [
        {
            _id: "3",
            title: "What is closure in JavaScript?",
            text: "Can someone explain closures with examples?",
            tags: [{ name: "javascript" }],
            answers: [],
            asked_by: "user3",
            ask_date_time: new Date().toISOString(),
            views: 20,
            vote_score: 5
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return unanswered questions using getUnansweredQuestions()", async () => {
        (Question.getUnansweredQuestions as jest.Mock).mockResolvedValue(mockQuestions);

        const strategy = new UnansweredSortStrategy();
        const result = await strategy.sort();

        expect(Question.getUnansweredQuestions).toHaveBeenCalled();
        expect(result).toEqual(mockQuestions);
    });
});
