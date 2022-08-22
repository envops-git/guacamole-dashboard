import encrypt from "$lib/encrypt";
import cookie from 'cookie';
import { connectionGET, connectionParametersGET } from '../../../../../lib/guacAPI/connections'
import { userEffectivePermissionsGET } from '../../../../../lib/guacAPI/users'

export async function GET(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken || !cookies.username) {
    return new Response(undefined, { status: 403 });
  }
  const connectionID = event.params.connectionID;
  const response = await userEffectivePermissionsGET(cookies.dataSource, cookies.accessToken, cookies.username);

  if (response.status != 200) {
    return new Response(undefined, { status: response.status });
  }

  const connectionPermissions = response.data.connectionPermissions;

  if(!Object.keys(connectionPermissions).includes(connectionID)){
    return new Response(undefined, { status: 403 });
  }

  const connectionResponse = await connectionGET(cookies.dataSource, cookies.accessToken, connectionID);

  if (connectionResponse.status != 200) {
    return new Response(undefined, { status: connectionResponse.status });
  }

  const connection = connectionResponse.data;

  const connectionParametersResponse = await connectionParametersGET(cookies.dataSource, cookies.accessToken, connectionID);
  if (connectionParametersResponse.status != 200) {
    return new Response(undefined, { status: connectionResponse.status });
  }

  const connectionParams = connectionParametersResponse.data;

  let token = encrypt({
    connection: {
      type: connection.protocol,
      settings: {
        ...connectionParams,
        "security": "any",
        'enable-wallpaper': false,
        "enable-drive": true,
        "create-drive-path": true,
      }
    }
  });

  return new Response(token, { status: 200 });
}