const readEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing ${key}!`);
  }
  console.log(`${key}=${value}`);
  return value;
};

const readEnvOpt = (key: string): string | null => {
  const value = Deno.env.get(key) ?? null;
  console.log(`${key}=${value}`);
  return value;
};

export const databaseUrl = readEnv("DATABASE_URL");
export const cognitoPoolId = readEnv("COGNITO_POOL_ID");
export const cognitoClientId = readEnv("COGNITO_CLIENT_ID");
export const busUrl = readEnv("BUS_URL");
export const analysisQueueUrl = readEnvOpt("ANALYSIS_QUEUE_URL");
export const adminmsgQueueUrl = readEnvOpt("ADMINMSG_QUEUE_URL");
