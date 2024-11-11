const readEnv = (key: string): string => {
  const value = import.meta.env[`VITE_${key}`];
  if (!value) {
    throw new Error(`Missing ${key}!`);
  }
  console.log(`${key}=${value}`);
  return value;
};

export const backendIp = readEnv("BACKEND_IP");
export const cognitoClientId = readEnv("COGNITO_CLIENT_ID");
