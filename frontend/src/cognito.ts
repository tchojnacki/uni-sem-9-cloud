import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { err, ok, Result, resultFromAsync } from "./Result";

const REGION = "us-east-1";
const ENDPOINT = "http://localhost:8003";
const CLIENT_ID = "8mw43nwedhv432ghl590umq20";

const cognitoClient = new CognitoIdentityProviderClient({
  region: REGION,
  endpoint: ENDPOINT,
});

type LogInResult = Result<
  { accessToken: string; refreshToken: string },
  string
>;

type SignUpResult = Result<null, string>;

export async function logIn(
  username: string,
  password: string
): Promise<LogInResult> {
  const response = await resultFromAsync(() =>
    cognitoClient.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      })
    )
  );
  if (response.tag === "err") {
    return err((response.err as Error).message);
  }
  if (!response.ok.AuthenticationResult) {
    return err("No authentication result");
  }
  const { AccessToken, RefreshToken } = response.ok.AuthenticationResult;
  if (!AccessToken || !RefreshToken) {
    return err("No access or refresh token");
  }
  return ok({ accessToken: AccessToken, refreshToken: RefreshToken });
}

export async function signUp(
  email: string,
  username: string,
  password: string
): Promise<SignUpResult> {
  const response = await resultFromAsync(() =>
    cognitoClient.send(
      new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: username,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }],
      })
    )
  );
  if (response.tag === "err") {
    return err((response.err as Error).message);
  }
  return ok(null);
}
