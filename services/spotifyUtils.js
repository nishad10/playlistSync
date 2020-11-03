var SpotifyWebApi = require('spotify-web-api-node');

const scopes = [
  'user-read-recently-played',
  'playlist-modify-public',
  'playlist-read-private',
  'user-library-read',
  'user-library-modify',
  'playlist-modify-private',
];

const getAuthorizeURL = (spotifyApi) => {
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  console.log(authorizeURL);
};

const setupSpotifyAPI = async () => {
  const clientId = process.env.SPOTIFYCLIENTID;
  const clientSecret = process.env.SPOTIFYCLIENTSECRET;
  const redirectUri = process.env.SPOTIFYREDIRECTURI;
  const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: redirectUri,
  });
  const authCode = process.env.SPOTIFYAUTHCODE;

  if (!authCode) {
    console.log(
      'You need to add SPOTIFYAUTHCODE in .env file. Use url below to get the code. It will be the parameter after http://localhost/?code='
    );
    getAuthorizeURL(spotifyApi);
  }
  console.log(authCode);
  try {
    const data = await spotifyApi.authorizationCodeGrant(authCode);
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    return spotifyApi;
  } catch (err) {
    console.log('Authorization code expired');
  }
};

const getPlaylistData = async () => {
  spotifyApi = await setupSpotifyAPI();
};
module.exports = { getPlaylistData, setupSpotifyAPI };
