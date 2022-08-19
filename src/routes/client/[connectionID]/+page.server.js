import cookie from 'cookie';
import { redirect } from '@sveltejs/kit';
import { getClientURL } from '../../../lib/guacAPI/url';
import { userEffectivePermissionsGET } from '../../../lib/guacAPI/users';
import { connectionGET, connectionParametersGET } from '../../../lib/guacAPI/connections';

export async function load({ request, url, params }) {
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
  const connectionResponse = await connectionGET(cookies.dataSource, cookies.accessToken, connectionID);
  if (connectionResponse.status != 200) {
    throw redirect(302,'/');
  }
  const connectionParametersResponse = await connectionParametersGET(cookies.dataSource, cookies.accessToken, connectionID);
  if (connectionParametersResponse.status != 200) {
    throw redirect(302,'/');
  }

  const clientURL = getClientURL(connectionID, cookies.dataSource, cookies.accessToken);

  return { ...connectionResponse.data, clientURL ,parameters: connectionParametersResponse.data};
}