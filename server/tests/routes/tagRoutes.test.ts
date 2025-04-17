import Tag from "../../models/tags";
const request = require("supertest");
const app = require("../../server");

describe("Tag Routes", () => {
    describe("GET /tag/getTagsWithQuestionNumber", () => {
        it("should return a paginated list of tags with question counts", async () => {
            const mockTags = [
                { name: "javascript", qcnt: 12 },
                { name: "typescript", qcnt: 5 },
                { name: "node.js", qcnt: 7 }
            ];

            Tag.getTagQuestionCount = jest.fn().mockResolvedValue(mockTags);

            const response = await request(app).get("/tag/getTagsWithQuestionNumber?page=1&limit=2");

            expect(response.statusCode).toBe(200);
            expect(response.body.data.length).toBeLessThanOrEqual(2);
            expect(response.body).toHaveProperty("pagination");
            expect(response.body.data).toEqual([
                { name: "javascript", qcnt: 12 },
                { name: "typescript", qcnt: 5 }
            ]);
        });
    });
});
