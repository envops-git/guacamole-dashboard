import cookie from 'cookie';
import { redirect } from '@sveltejs/kit';
import { tokensPOST } from '$lib/guacAPI/tokens';

export async function load({ request, url }) {
  const cookies = cookie.parse((await request.headers.get('cookie')) || '');
  if (cookies.accessToken == undefined) {
    if (url.pathname != '/login') {
      throw redirect(302, '/login');
    }
  } else {
    const accessToken = cookies.accessToken;
    const response = await tokensPOST({ token: accessToken });
    if (response.status != 201) {
      if (url.pathname != '/login') {
        throw redirect(302, '/login');
      }
      return;
    }

    if (url.pathname.includes('/login')) {
      throw redirect(302, '/');
    }
    return { userData: response.data }
  }
}