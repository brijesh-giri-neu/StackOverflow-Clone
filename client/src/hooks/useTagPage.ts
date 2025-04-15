import { useEffect, useState } from "react";
import { getTagsWithQuestionNumber } from "../services/tagService";
import { PaginationMetadataType, TagResponseType } from "../types/entityTypes";

/**
 * Interface to define TagPage props
 */
interface UseTagPageProps {
  page: number;
  limit: number;
}

/**
 * The custom hook to handle the state and logic for fetching tags with the number of questions associated with each tag.
 * The interacts with the tags service.
 * @returns the list of tags with the number of questions associated with each tag
 */
export const useTagPage = ({ page, limit }: UseTagPageProps) => {
  const [tlist, setTlist] = useState<TagResponseType[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadataType>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: limit,
  });

  /**
   * the effect interacts with the tag service to fetch the tags with the number of questions associated with each tag.
   * 
   * It has no dependencies and runs only once when the component renders.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTagsWithQuestionNumber();
        setTlist(res.data || []);
        setPagination(res?.pagination || pagination);
      } catch (e) {
        console.error("Error fetching tags:", e);
      }
    };

    fetchData();
  }, [page, limit]);

  return { tlist, pagination };
};
