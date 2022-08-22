import { tokensPOST } from "$lib/guacAPI/tokens";

export async function POST(event) {
  const { username, password } = await event.request.json();

  if (!username || !password || username == '' || password == '') {
    return new Response(undefined, { status: 400 });
  }

  const response = await tokensPOST({ username, password})
  if (response.status != 201) {
    return new Response(undefined, { status: response.status });
  }

  const setCookieHeaders = new Headers();
  setCookieHeaders.append('set-cookie', `accessToken=${response.data.authToken}; Max-Age=${60 * 60 * 24 * 365 * 5}; SameSite=Strict; Path=/; HttpOnly; Secure;`);
  setCookieHeaders.append('set-cookie', `dataSource=${response.data.dataSource}; Max-Age=${60 * 60 * 24 * 365 * 5}; SameSite=Strict; Path=/; HttpOnly; Secure;`);
  setCookieHeaders.append('set-cookie', `username=${response.data.username}; Max-Age=${60 * 60 * 24 * 365 * 5}; SameSite=Strict; Path=/; HttpOnly; Secure;`);

  return new Response(JSON.stringify(response.data), {status: 201, headers: setCookieHeaders});
}