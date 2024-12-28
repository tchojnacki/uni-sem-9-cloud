import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClientId } from "../common/env";

const REGION = "us-east-1";

const cognitoClient = new CognitoIdentityProviderClient({
  region: REGION,
});

export async function cognitoLogIn(
  username: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await cognitoClient.send(
    new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: cognitoClientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    })
  );
  const accessToken = response.AuthenticationResult!.AccessToken!;
  const refreshToken = response.AuthenticationResult!.RefreshToken!;
  return { accessToken, refreshToken };
}

export async function cognitoSignUp(
  email: string,
  username: string,
  password: string
): Promise<void> {
  await cognitoClient.send(
    new SignUpCommand({
      ClientId: cognitoClientId,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    })
  );
}
