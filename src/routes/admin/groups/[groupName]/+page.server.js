import cookie from 'cookie';
import { redirect } from '@sveltejs/kit';
import { groupPermissionsGET, groupUsersGET } from '../../../../lib/guacAPI/groups'

export async function load({ params, request }) {

  const cookies = cookie.parse((await request.headers.get('cookie')) || '');
  const permissionsResponse = await groupPermissionsGET(cookies.dataSource, cookies.accessToken, params.groupName);
  const usersResponse = await groupUsersGET(cookies.dataSource, cookies.accessToken, params.groupName);

  if (permissionsResponse.status != 200 || usersResponse.status != 200) {
    throw redirect(302, '/admin/groups');
  }

  let connections = Object.keys(permissionsResponse.data.connectionPermissions);
  let permissions = permissionsResponse.data.systemPermissions;

  return { users: usersResponse.data, connections, permissions, groupName: params.groupName }
}

