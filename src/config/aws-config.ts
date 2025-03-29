
import { Amplify } from 'aws-amplify';

// Replace with your AWS Cognito details
export const initializeAWS = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_example', // Replace with your User Pool ID
        userPoolClientId: 'example-client-id', // Replace with your App Client ID
        loginWith: {
          email: true,
          phone: true,
          username: false
        }
      }
    }
  });
};
