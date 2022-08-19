export async function GET(event) {
  const setCookieHeaders = new Headers();
  setCookieHeaders.append('set-cookie', `accessToken=; Max-Age=0; SameSite=Strict; Path=/; HttpOnly; Secure;`);
  setCookieHeaders.append('set-cookie', `dataSource=; Max-Age=0; SameSite=Strict; Path=/; HttpOnly; Secure;`);
  return new Response(undefined, { status: 204, headers: setCookieHeaders })
}