import Question from "../../models/questions";
import Vote from "../../models/votes";
import { VoteType } from "../../types/types";

jest.mock("../../services/questionSortService", () => ({
    sortQuestions: jest.fn().mockResolvedValue([
        {
            _id: "q123",
            title: "SwiftUI, CloudKit and all the hassles of mapping: Why Apple, Why?",
            text: "Throughout the years...",
            asked_by: "Hima Tellakula",
            views: 26,
            ask_date_time: "2025-04-13T08:44:03.524Z",
            vote_score: 0,
            tags: [
                { _id: "t1", name: "cloudkit" },
                { _id: "t2", name: "swiftUI" }
            ],
            answers: [],
        }
    ])
}));

jest.mock("../../services/questionFilterService", () => ({
    filterQuestions: jest.fn().mockImplementation((list) => list)
}));


jest.mock('express-session', () => {
    return () => (req: any, res: any, next: () => void) => {
        if (!req.headers['x-mock-no-session']) {
            req.session = { userId: 'mockUserId' };
        } else {
            req.session = {};
        }
        next();
    };
});


const request = require("supertest");
const app = require("../../server");
describe("Question Routes", () => {
    let consoleSpy: jest.SpyInstance;

    beforeAll(() => {
        consoleSpy = jest.spyOn(console, "error").mockImplementation(() => { });
        jest.spyOn(console, "log").mockImplementation(() => { });
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    describe("POST /question/addQuestion", () => {
        const reqBody = {
            title: "Sample Title",
            text: "Sample question content",
            tags: [{ name: "tag1" }, { name: "tag2" }],
            asked_by: "User123",
            ask_date_time: new Date("2024-04-16T10:00:00Z"),
        };

        const mockQuestion = { ...reqBody, _id: "question789", answers: [], views: 0, vote_score: 0 };

        it("should create and return a new question", async () => {
            Question.createQuestion = jest.fn().mockResolvedValue(mockQuestion);

            const response = await request(app).post("/question/addQuestion").send(reqBody);
            //expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockQuestion);
        });
    });

    describe("GET /question/getQuestionById/:qid", () => {
        const qid = "q123";
        const mockQuestion = {
            _id: qid,
            title: "Question title",
            text: "Question text",
            answers: [],
            views: 1,
            vote_score: 2,
            toObject: () => mockQuestion
        };

        const enrichedAnswers = [
            {
                _id: "a1",
                text: "Answer",
                currentUserVote: 1,
                toObject: () => ({ _id: "a1", text: "Answer" })
            }
        ];

        it("should return the question if found and no session user", async () => {
            Question.findByIdAndIncrementViews = jest.fn().mockResolvedValue(mockQuestion);

            const response = await request(app)
                .get(`/question/getQuestionById/${qid}`)
                .set('x-mock-no-session', 'true'); // 👈 tells the mock not to inject userId

            expect(response.statusCode).toBe(200);

            const { toObject, ...expected } = mockQuestion;
            expect(response.body).toMatchObject({
                ...expected,
                currentUserVote: VoteType.NoVote
            });
        });

        it("should return 400 if question is not found", async () => {
            Question.findByIdAndIncrementViews = jest.fn().mockResolvedValue(null);

            const response = await request(app).get(`/question/getQuestionById/${qid}`);
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({ message: "Question not found" });
        });

        const agent = request.agent(app);

        it("should return enriched question with votes if session user exists", async () => {
            const enrichedAnswersWithVote = enrichedAnswers.map(a => ({ ...a.toObject(), currentUserVote: VoteType.UpVote }));

            Vote.find = jest.fn().mockResolvedValue([
                { postId: qid, type: VoteType.UpVote },
                { postId: "a1", type: VoteType.UpVote }
            ]);

            Question.findByIdAndIncrementViews = jest.fn().mockResolvedValue({
                ...mockQuestion,
                currentUserVote: VoteType.UpVote,
                answers: enrichedAnswers
            });

            // ✅ Simulate session cookie
            const cookie = 'connect.sid=s%3AvalidSessionId.mocked'; // replace with how you actually manage sessions

            const response = await agent
                .get(`/question/getQuestionById/${qid}`)
                .set('Cookie', [cookie]);

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                _id: qid,
                title: "Question title",
                text: "Question text",
                views: 1,
                vote_score: 2,
                answers: enrichedAnswersWithVote
            });
        });

    });

    describe("GET /question/getQuestion", () => {
        it("should return a paginated list of questions", async () => {
            Question.find = jest.fn().mockResolvedValue([
                {
                    _id: "q2", title: "Q2", views: 20, vote_score: 3,
                    tags: [{ name: "tag1" }, { name: "tag2" }],
                    asked_by: "User123",
                    ask_date_time: new Date("2024-04-16T10:00:00Z"),
                    answers: []
                }
            ]);

            const response = await request(app).get("/question/getQuestion");
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(response.body).toHaveProperty("pagination");
        });

        it("should return a paginated list of questions after search", async () => {
            Question.find = jest.fn().mockResolvedValue([
                {
                    _id: "q2", title: "Q2", views: 20, vote_score: 3,
                    tags: [{ name: "tag1" }, { name: "tag2" }],
                    asked_by: "User123",
                    ask_date_time: new Date("2024-04-16T10:00:00Z"),
                    answers: []
                }
            ]);

            const response = await request(app).get("/question/getQuestion?order=newest&search=Q2&page=1&limit=10");
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("data");
            expect(response.body).toHaveProperty("pagination");
        });
    });
});
