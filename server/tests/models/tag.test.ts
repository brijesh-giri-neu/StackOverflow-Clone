import mongoose from "mongoose";
import Tag from "../../models/tags";

describe("Tag Model - Static Methods", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("findOrCreateMany", () => {
        it("should find existing tags and insert new ones", async () => {
            const tagNames = ["javascript", "nodejs"];

            const existingTags = [{ name: "javascript" }];

            const findMock = jest.spyOn(Tag, "find");
            findMock
                .mockResolvedValueOnce(existingTags as any) // first call: find existing
                .mockResolvedValueOnce([
                    { name: "javascript" },
                    { name: "nodejs" }
                ] as any); // second call: return all

            const insertMock = jest.spyOn(Tag, "insertMany").mockResolvedValueOnce([{ name: "nodejs" }] as any);

            const result = await Tag.findOrCreateMany(tagNames);

            expect(findMock).toHaveBeenCalledTimes(2);
            expect(insertMock).toHaveBeenCalledWith([{ name: "nodejs" }]);
            expect(result).toEqual([
                { name: "javascript" },
                { name: "nodejs" }
            ]);
        });

        it("should not insert if all tags exist", async () => {
            const tagNames = ["js", "ts"];

            const findMock = jest.spyOn(Tag, "find").mockResolvedValue(tagNames.map(name => ({ name })) as any);
            const insertMock = jest.spyOn(Tag, "insertMany");

            const result = await Tag.findOrCreateMany(tagNames);

            expect(insertMock).not.toHaveBeenCalled();
            expect(result).toEqual(tagNames.map(name => ({ name })));
        });
    });

    describe("validateTags", () => {
        it("should return true if all tag IDs exist", async () => {
            const tagIds = [
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId()
            ];

            const countMock = jest.spyOn(Tag, "countDocuments").mockResolvedValue(tagIds.length);

            const result = await Tag.validateTags(tagIds);

            expect(countMock).toHaveBeenCalledWith({ _id: { $in: tagIds } });
            expect(result).toBe(true);
        });

        it("should return false if not all tag IDs exist", async () => {
            const tagIds = [
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId()
            ];

            const countMock = jest.spyOn(Tag, "countDocuments").mockResolvedValue(1);

            const result = await Tag.validateTags(tagIds);

            expect(result).toBe(false);
        });
    });

    describe("getTagQuestionCount", () => {
        it("should return tag counts", async () => {
            const mockAggResults = [
                { name: "react", qcnt: 5 },
                { name: "vue", qcnt: 2 }
            ];

            const aggMock = jest.spyOn(Tag, "aggregate").mockResolvedValueOnce(mockAggResults as any);

            const result = await Tag.getTagQuestionCount();

            expect(aggMock).toHaveBeenCalledWith([
                {
                    $lookup: {
                        from: "Question",
                        localField: "_id",
                        foreignField: "tags",
                        as: "questionTags"
                    }
                },
                {
                    $project: {
                        name: 1,
                        qcnt: { $size: "$questionTags" }
                    }
                }
            ]);

            expect(result).toEqual(mockAggResults);
        });
    });
});
