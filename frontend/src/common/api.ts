import { useCallback, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";

const API_BASEPATH = `${import.meta.env.VITE_BACKEND_IP}/api/v1`;

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
    (url: string) =>
      fetch(`${API_BASEPATH}${url}`, { headers }).then((res) => res.json()),
    [headers]
  );

  return { get };
}
