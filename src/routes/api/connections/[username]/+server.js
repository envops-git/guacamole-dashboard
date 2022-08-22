import { userEffectivePermissionsGET } from "../../../../lib/guacAPI/users";
import { connectionGET, connectionParametersGET } from "../../../../lib/guacAPI/connections";
import { getClientURL } from "../../../../lib/guacAPI/url";

import cookie from 'cookie';

export async function GET(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }
  const username = event.params.username;
  const response = await userEffectivePermissionsGET(cookies.dataSource, cookies.accessToken, username);

  if (response.status != 200) {
    return new Response(undefined, { status: response.status });
  }

  const connectionPermissions = response.data.connectionPermissions;
  try {
    const connections = await Promise.all(Object.keys(connectionPermissions).map(async (connectionID) => {
      const connectionResponse = await connectionGET(cookies.dataSource, cookies.accessToken, connectionID);
      if (connectionResponse.status != 200) {
        return Promise.reject(connectionResponse.status);
      }

      const clientURL = getClientURL(connectionResponse.data.identifier, cookies.dataSource, cookies.accessToken);

      return { ...connectionResponse.data, clientURL };
    }));
    return new Response(JSON.stringify(connections), { status: 200 });

  } catch (error) {
    console.log(error);
    return new Response(undefined, { status: error });
  }
}