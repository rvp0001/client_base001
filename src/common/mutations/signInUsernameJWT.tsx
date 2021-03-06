import gql from 'graphql-tag';
export default gql`
mutation signInUsernameJWT($client: String,
    $lang: String,
    $applicationid: String,
    $username: String,
    $password: String,
    )
    {
      signInUsernameJWT(
        client: $client,
    lang: $lang,
    applicationid: $applicationid,
    username: $username,
    password: $password,

      )
      {
        applicationid
        username
        email
        mobile
        lang
        token
        userauthorisations
        status
        
      }
    }  
`;
