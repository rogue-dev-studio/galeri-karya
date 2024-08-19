const apiKeyUrl = 'https://gist.githubusercontent.com/omeans-team/11119435f6250630498f4efd83a2177f/raw/api-key-yt-v3.txt';
const clientIdUrl = 'https://gist.githubusercontent.com/omeans-team/c44d1ce18bd42e6ea276642fa4fba0a2/raw/OAuth-2-Client-IDs-client-id.txt';
const clientSecretUrl = 'https://gist.githubusercontent.com/omeans-team/d27c8e304f32187f4973ef03546ac996/raw/OAuth-2-Client-IDs-client-secret.txt';

async function fetchConfig() {
  const apiKeyResponse = await fetch(apiKeyUrl);
  const apiKey = await apiKeyResponse.text();

  const clientIdResponse = await fetch(clientIdUrl);
  const clientId = await clientIdResponse.text();

  const clientSecretResponse = await fetch(clientSecretUrl);
  const clientSecret = await clientSecretResponse.text();

  return { apiKey, clientId, clientSecret };
}

export default fetchConfig;