import cookie from 'cookie';
import { error, redirect } from '@sveltejs/kit';
import { tokensPOST } from '$lib/guacAPI/tokens';
import { userGroupsGET } from '../lib/guacAPI/users'

export async function load({ request, url }) {
  const cookies = cookie.parse((await request.headers.get('cookie')) || '');
  if (cookies.accessToken == undefined || cookies.dataSource == undefined || cookies.username == undefined) {
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

    const userResponse = await userGroupsGET(cookies.dataSource, cookies.accessToken, cookies.username);

    if (userResponse.status != 200) {
      throw error(userResponse.status);
    }

    const userGroups = userResponse.data;

    if (userGroups.includes('Admins')) {
      if (!url.pathname.includes('/admin')) {
        throw redirect(302, '/admin');
      }
    } else {
      if (url.pathname.includes('/admin')) {
        throw redirect(302, '/clientConnections');
      }
      if (url.pathname == '/') {
        throw redirect(302, '/clientConnections');
      }
    }

    if (url.pathname.includes('/login')) {
      throw redirect(302, '/clientConnections');
    }
    return { userData: {...response.data, admin: userGroups.includes('Admins')} }
  }
}