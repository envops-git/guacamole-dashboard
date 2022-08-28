import { activeConnectionsGET, connectionGET, killActiveConnectionPATCH } from "../../../lib/guacAPI/connections";
import cookie from 'cookie';

export async function GET(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }

  const activeConnectionsResponse = await activeConnectionsGET(cookies.dataSource, cookies.accessToken);

  if (activeConnectionsResponse.status != 200) {
    return new Response(undefined, { status: activeConnectionsResponse.status });
  }

  if (!Object.keys(activeConnectionsResponse.data).length) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  try {
    const activeConnections = await Promise.all(Object.keys(activeConnectionsResponse.data).map(async (key) => {
      const connectionResponse = await connectionGET(cookies.dataSource, cookies.accessToken, activeConnectionsResponse.data[key].connectionIdentifier);
      if (connectionResponse.status != 200) {
        return Promise.reject(connectionResponse.status);
      }
      return { ...activeConnectionsResponse.data[key], name: connectionResponse.data.name }
    }))

    return new Response(JSON.stringify(activeConnections), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(undefined, { status: error });
  }
}

export async function DELETE(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }

  try {
    const deleteList = await event.request.json();

    if (!deleteList.length) {
      return new Response(undefined, { status: 204 });
    }

    await Promise.all(deleteList.map((id) => {
      killActiveConnectionPATCH(cookies.dataSource, cookies.token, id);
    }));
    return new Response(undefined, { status: 204 });
  } catch (error) {
    console.log(error);
    return new Response(undefined, { status: error });
  }

}