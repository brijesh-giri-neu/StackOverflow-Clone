import mongoose from "mongoose";
import TagSchema from "./schema/tag";
import { ITagDocument, ITagModel, ITag, TagCountResponse } from "../types/types";

/**
 * Static Method: Find existing tags or create new ones.
 * This method checks if the tags already exist in the database. 
 * If not, it creates new tags and returns a list of all tags (existing and newly created).
 * 
 * @param {string[]} tagNames - An array of tag names to check and create if not existing.
 * @returns {Promise<ITag[]>} - A promise that resolves to an array of tags, either found or newly created.
 */
TagSchema.statics.findOrCreateMany = async function (tagNames: string[]): Promise<ITag[]> {
    const existingTags = await this.find({ name: { $in: tagNames } });
    const existingTagNames = existingTags.map((tag) => tag.name);

    const newTags = tagNames.filter((name) => !existingTagNames.includes(name)).map((name) => ({ name }));
    if (newTags.length > 0) {
        await this.insertMany(newTags);
    }
    return this.find({ name: { $in: tagNames } });
};

/**
 * Static Method: Validate if all given tag IDs exist.
 * 
 * @param {mongoose.Types.ObjectId[]} tagIds - An array of tag IDs to validate.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if all the tag IDs exist.
 */
TagSchema.statics.validateTags = async function (tagIds: mongoose.Types.ObjectId[]): Promise<boolean> {
    const count = await this.countDocuments({ _id: { $in: tagIds } });
    return count === tagIds.length;
};

/**
 * Statics method to get the question count for each tag.
 * 
 * 
 * @returns {Promise<TagCountResponse[]>} A promise that resolves to an array of tag counts
 * @throws {Error} Throws an error if the aggregation fails
 */
TagSchema.statics.getTagQuestionCount = async function (): Promise<TagCountResponse[]> {
    const result = await this.aggregate([
        {
            $lookup: {
                from: "Question",
                localField: "_id",
                foreignField: "tags",
                as: "questionTags",
            }
        },
        {
            $project: {
                name: 1,
                qcnt: { $size: "$questionTags" }
            }
        }
    ]);
    return result.map(tag => ({
        name: tag.name,
        qcnt: tag.qcnt,
    }));
};

/**
 * Compile the schema into a model.
 * This model provides static methods for querying and manipulating tag documents in the database.
 * 
 * @type {mongoose.Model<ITagDocument, ITagModel>}
 */
const Tag = mongoose.model<ITagDocument, ITagModel>("Tag", TagSchema);

export default Tag;
