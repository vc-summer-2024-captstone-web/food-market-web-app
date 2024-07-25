export const VerifyEmail = `
<html lang='en'>
  <body>
    <h1>Thank You For Signing Up</h1>
    <p>Welcome to the {{appName}}, {{name}}</p>
    <p>Your verification code is: <b>{{token}}</b></p>
    <p><a href='https://food-market-web-app.netlify.app/auth/verify'>Click here to verify your email</a></p>
    <p>Or copy and paste this link into your browser: <br />https://food-market-web-app.netlify.app/auth/verify</p>
  </body>
</html>
`;
