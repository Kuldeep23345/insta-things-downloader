import React from "react";

export type RequestConfigType = {
  signal?: AbortSignal | null;
};

import { useFetch } from "@/hooks/use-fetch";
import { IG_GraphQLResponseDto } from "./schema";

import { wrapperFetchJsonResponse } from "./fetch-utils";

export type GetInstagramPostRequest = {
  shortcode: string;
};

export type GetInstagramPostResponse = IG_GraphQLResponseDto;

export function useGetInstagramPost() {
  const fetch = useFetch();

  return React.useCallback(
    (data: GetInstagramPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`/api/instagram/p/${data.shortcode}`, requestConfig).then(
        wrapperFetchJsonResponse<GetInstagramPostResponse>
      );
    },
    [fetch]
  );
}