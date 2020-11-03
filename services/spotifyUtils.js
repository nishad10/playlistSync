const SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');

const scopes = [
  'user-read-recently-played',
  'playlist-modify-public',
  'playlist-read-private',
  'user-library-read',
  'user-library-modify',
  'playlist-modify-private',
];
const getCache = () => {
  try {
    let rawdata = fs.readFileSync('spotify.json');
    let spotifyCache = JSON.parse(rawdata);
    return spotifyCache;
  } catch (error) {
    return {};
  }
};
const writeCache = (data) => {
  data = JSON.stringify(data);
  fs.writeFileSync('spotify.json', data);
};
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
  let spotifyCache = getCache();
  if (spotifyCache['accessToken'] && spotifyCache['refreshToken']) {
    spotifyApi.setAccessToken(spotifyCache['accessToken']);
    spotifyApi.setRefreshToken(spotifyCache['refreshToken']);
    console.log('Setup Done!');
    return spotifyApi;
  }
  if (!authCode) {
    console.log(
      'You need to add SPOTIFYAUTHCODE in .env file. Use url below to get the code. It will be the parameter after http://localhost/?code='
    );
    getAuthorizeURL(spotifyApi);
  }
  try {
    const data = await spotifyApi.authorizationCodeGrant(authCode);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    writeCache({
      accessToken: data.body['access_token'],
      refreshToken: data.body['refresh_token'],
    });
    return spotifyApi;
  } catch (err) {
    console.log(
      'Authorization code expired, regenerate using url below and enter in .env again'
    );
    getAuthorizeURL(spotifyApi);
  }
};

const getPlaylistData = async () => {
  spotifyApi = await setupSpotifyAPI();
  spotifyApi.getUserPlaylists().then(
    function (data) {
      console.log('Retrieved playlists', data.body);
    },
    function (err) {
      console.log('Something went wrong!', err);
    }
  );
};
module.exports = { getPlaylistData, setupSpotifyAPI };
