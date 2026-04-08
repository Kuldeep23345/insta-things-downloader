"use client";

import React from "react";


type FetchParams = Parameters<typeof fetch>;

export type FetchInput = FetchParams[0];
export type FetchInit = FetchParams[1];


export function useFetch() {
  return React.useCallback(
    async (input: FetchInput, init?: FetchInit): Promise<Response> => {
      let headers: HeadersInit = {
        "x-custom-lang": "en",
      };

      if (!(init?.body instanceof FormData)) {
        headers = {
          ...headers,
          "Content-Type": "application/json",
        };
      }

      const combinedHeaders = new Headers({ ...headers, ...init?.headers });

      return fetch(input, {
        ...init,
        headers: combinedHeaders,
      });
    },
    []
  );
}