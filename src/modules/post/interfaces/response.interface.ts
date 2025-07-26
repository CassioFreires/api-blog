import { IPost } from "./post.interface";

interface IReturnSingleResponse {
  message: string;
  data?: IPost; // único post
}

interface IReturnListResponse {
  message: string;
  data?: IPost[]; // lista de posts
  pagination?: {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    perPage?: number;
    hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  nextPage?: number | null;
  previousPage?: number | null;
  };
}

export type IReturnResponse = IReturnSingleResponse | IReturnListResponse;