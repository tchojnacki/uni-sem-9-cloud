import { useCallback, useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import { backendIp } from "./env";

const API_BASEPATH = `http://${backendIp}/api/v1`;

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

  const createSocket = useCallback(() => {
    const socket = new WebSocket(`${API_BASEPATH}/ws`);
    socket.addEventListener("open", () => {
      if (!identity) return;
      const event = { type: "authenticate", data: identity.accessToken };
      socket.send(JSON.stringify(event));
    });
    return socket;
  }, [identity]);

  return { get, post, createSocket };
}
