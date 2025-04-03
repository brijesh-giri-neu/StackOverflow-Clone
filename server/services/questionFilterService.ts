import { IQuestion } from '../types/types';

/**
 * Filters the questions based on the search query.
 * This function filters the list of questions by checking if the question's title, text, 
 * and tags match any of the keywords or tags in the search query.
 * 
 * @param {IQuestion[]} questions - List of questions to filter
 * @param {string} search - The search query containing keywords and optional tags
 * @returns {IQuestion[]} - List of questions that match the search criteria
 */
export function filterQuestions(questions: IQuestion[], search: string): IQuestion[] {
    const { tagMatches, textSearch, keywords } = extractSearchTerms(search);

    return questions.filter(q => {
        const titleLower = q.title.toLowerCase();
        const textLower = q.text.toLowerCase();
        const questionTags = q.tags.map(tag => tag.name.toLowerCase());

        // Check if the question contains ANY keyword in title or text
        let matchesKeyword = false;
        if (textSearch.length > 0) { matchesKeyword = hasKeywordMatch(keywords, titleLower, textLower); }

        // Check if the question contains ALL required tags
        let matchesAllTags = false;
        if (tagMatches.length > 0) { matchesAllTags = hasTagMatch(tagMatches, questionTags); }
        
        return matchesKeyword || matchesAllTags;
    });
}

/**
 * Checks if any of the keywords match the title or text of the question.
 * @param keywords The list of keywords to check against
 * @param titleLower The lowercased title of the question
 * @param textLower The lowercased text of the question
 * @returns True if any keyword matches the title or text
 */
function hasKeywordMatch(keywords: string[], titleLower: string, textLower: string): boolean {
    return keywords.some(word => titleLower.includes(word) || textLower.includes(word));
}

/**
 * Checks if all required tags match the tags of the question.
 * @param tagMatches The list of tags to match
 * @param questionTags The tags of the question
 * @returns True if all tags are present in the question's tags
 */
function hasTagMatch(tagMatches: string[], questionTags: string[]): boolean {
    return tagMatches.every(tag => questionTags.includes(tag));
}

/**
 * Extracts search terms from the search query.
 * This function separates tags and keywords from the search query string. Tags are enclosed 
 * in square brackets and keywords are words separated by spaces.
 * 
 * @param {string} search - The search query containing tags and keywords
 * @returns {Object} - An object containing:
 *    - tagMatches: A list of tags extracted from the query
 *    - textSearch: The remaining part of the query for text-based search
 *    - keywords: A list of individual keywords for text search
 */
function extractSearchTerms(search: string) {
    const tagPattern = /\[([^\]]+)\]/g;
    const tagMatches = [...search.matchAll(tagPattern)].map(match => match[1].toLowerCase());
    const textSearch = search.replace(tagPattern, '').trim();
    const keywords: string[] = textSearch.trim().split(' ');
    return { tagMatches, textSearch, keywords };
}