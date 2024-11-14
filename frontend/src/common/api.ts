import { useCallback, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import { backendIp } from "./env";

const API_BASEPATH = `${backendIp}/api/v1`;

export function useApi() {
  const { identity } = useAuth();

  const headers = useMemo(
    () =>
      identity
        ? {
            Authorization: `Bearer ${identity.accessToken}`,
          }
        : undefined,
    [identity]
  );

  const get = useCallback(
    <T>(url: string): Promise<T> =>
      fetch(`${API_BASEPATH}${url}`, { headers }).then((res) => res.json()),
    [headers]
  );

  const post = useCallback(
    <T>(url: string, body: object): Promise<T> =>
      fetch(`${API_BASEPATH}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(body),
      }).then((res) => res.json()),
    [headers]
  );

  return { get, post };
}
