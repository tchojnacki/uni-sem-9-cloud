export type Result<T, E> = { tag: "ok"; ok: T } | { tag: "err"; err: E };

export function ok<T, E>(ok: T): Result<T, E> {
  return { tag: "ok", ok };
}

export function err<T, E>(err: E): Result<T, E> {
  return { tag: "err", err };
}

export function resultFrom<T>(closure: () => T): Result<T, unknown> {
  try {
    const ok = closure();
    return { tag: "ok", ok };
  } catch (err: unknown) {
    return { tag: "err", err };
  }
}

export async function resultFromAsync<T>(
  closure: () => Promise<T>
): Promise<Result<T, unknown>> {
  try {
    const ok = await closure();
    return { tag: "ok", ok };
  } catch (err: unknown) {
    return { tag: "err", err };
  }
}
