
import { Amplify } from 'aws-amplify';

// Replace with your AWS Cognito details
export const initializeAWS = () => {
  Amplify.configure({
    Auth: {
      region: 'us-east-1', // Replace with your region
      userPoolId: 'us-east-1_example', // Replace with your User Pool ID
      userPoolWebClientId: 'example-client-id', // Replace with your App Client ID
      authenticationFlowType: 'USER_SRP_AUTH',
    }
  });
};
