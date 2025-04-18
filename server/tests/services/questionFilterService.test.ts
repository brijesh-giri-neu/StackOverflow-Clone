import { filterQuestions } from "../../services/questionFilterService";
import { IQuestion } from "../../types/types";

describe("filterQuestions", () => {
    const mockQuestions: IQuestion[] = [
        {
            _id: "1",
            title: "How to use React useState hook?",
            text: "I am trying to manage state in a functional component.",
            tags: [{ name: "react" }, { name: "hooks" }],
            answers: [],
            asked_by: "user1",
            ask_date_time: new Date().toDateString(),
            views: 10,
            vote_score: 5
        },
        {
            _id: "2",
            title: "Android Studio build error",
            text: "Getting build failed when syncing project.",
            tags: [{ name: "android" }, { name: "gradle" }],
            answers: [],
            asked_by: "user2",
            ask_date_time: new Date().toDateString(),
            views: 12,
            vote_score: 2
        },
        {
            _id: "3",
            title: "CSS Flexbox alignment issues",
            text: "I can't center elements with flexbox.",
            tags: [{ name: "css" }, { name: "flexbox" }],
            answers: [],
            asked_by: "user3",
            ask_date_time: new Date().toDateString(),
            views: 5,
            vote_score: 0
        }
    ];

    it("should return questions matching a text keyword", () => {
        const result = filterQuestions(mockQuestions, "react"); // lowercase "react"
        expect(result).toHaveLength(1);
        expect(result[0]._id).toBe("1");
    });

    it("should return questions matching a single tag", () => {
        const result = filterQuestions(mockQuestions, "[css]");
        expect(result).toHaveLength(1);
        expect(result[0]._id).toBe("3");
    });

    it("should return questions matching multiple tags", () => {
        const result = filterQuestions(mockQuestions, "[react][hooks]");
        expect(result).toHaveLength(1);
        expect(result[0]._id).toBe("1");
    });

    it("should return questions matching both keyword and tag", () => {
        const result = filterQuestions(mockQuestions, "[flexbox] center");
        expect(result).toHaveLength(1);
        expect(result[0]._id).toBe("3");
    });

    it("should return empty array if no match found", () => {
        const result = filterQuestions(mockQuestions, "[java] springboot");
        expect(result).toHaveLength(0);
    });

    it("should return no results for empty search since no default fallback", () => {
        const result = filterQuestions(mockQuestions, "");
        expect(result).toHaveLength(0);
    });
});
