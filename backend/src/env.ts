const readEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing ${key}!`);
  }
  console.log(`${key}=${value}`);
  return value;
};

export const databaseUrl = readEnv("DATABASE_URL");
export const cognitoPoolId = readEnv("COGNITO_POOL_ID");
export const cognitoClientId = readEnv("COGNITO_CLIENT_ID");
