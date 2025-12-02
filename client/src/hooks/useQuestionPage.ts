import { useEffect, useState } from "react";
import { getQuestionsByFilter } from "../services/questionService";
import { PaginationMetadataType, QuestionResponseType } from "../types/entityTypes";

/**
 * Interface to define question page props
 */
interface UseQuestionPageProps {
  order: string;
  search: string;
  page: number;
  limit: number;
}

/**
 * A custom hook to handle the state and logic for fetching questions based on the filter parameters.
 * The hook interacts with the question service to fetch questions based on the order and search query entered by the user.
 * @param props containing the order and search query entered by the user 
 * @returns the list of questions fetched based on the filter parameters
 */
export const useQuestionPage = ({ order, search, page, limit }: UseQuestionPageProps) => {
  const [qlist, setQlist] = useState<QuestionResponseType[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadataType>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: limit,
  });

  /**
   * The effect to fetch questions based on the filter parameters.
   * 
   * the effect runs when the order or search query changes.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getQuestionsByFilter(order, search, page, limit);
        setQlist(res.data || []);
        setPagination(res?.pagination || {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize: limit,
        });
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData();
  }, [order, search, page, limit]);

  return { qlist, pagination };
};
