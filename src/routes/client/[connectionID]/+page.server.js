import cookie from 'cookie';
import { redirect } from '@sveltejs/kit';
import { userEffectivePermissionsGET } from '../../../lib/guacAPI/users';
import { connectionGET, connectionParametersGET } from '../../../lib/guacAPI/connections';

export async function load({ request, params }) {
  const cookies = cookie.parse((await request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken || !cookies.username) {
    return new Response(undefined, { status: 403 });
  }
  const response = await userEffectivePermissionsGET(cookies.dataSource, cookies.accessToken, cookies.username);
  if (response.status != 200) {
    throw redirect(302,'/');
  }

  const connectionID = params.connectionID;
  if (!Object.keys(response.data.connectionPermissions).includes(connectionID)) {
    throw redirect(302,'/');
  }

  return {
    connectionID
  }
}