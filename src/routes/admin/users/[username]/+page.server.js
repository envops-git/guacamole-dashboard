import cookie from 'cookie';
import { redirect } from '@sveltejs/kit';
import { userPermissionsGET } from '../../../../lib/guacAPI/users'

export async function load({ params, request }) {

  const cookies = cookie.parse((await request.headers.get('cookie')) || '');
  const permissionsResponse = await userPermissionsGET(cookies.dataSource, cookies.accessToken, params.username);

  if (permissionsResponse.status != 200) {
    throw redirect(302, '/admin/users');
  }

  let connections = Object.keys(permissionsResponse.data.connectionPermissions);
  let permissions = permissionsResponse.data.systemPermissions;

  return { connections, permissions, username: params.username }
}

