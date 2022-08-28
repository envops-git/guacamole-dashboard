import cookie from 'cookie';
import { connectionsGET } from '../../../lib/guacAPI/connections';


export async function GET(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }
  try {
    const response = await connectionsGET(cookies.dataSource, cookies.accessToken);
    if (response.status != 200) {
      return new Response(undefined, { status: response.status });
    }
    const connectionIDs = Object.keys(response.data);
    let connections = [];
    connectionIDs.map((id) => {
      connections.push({id, ...response.data[id]})
    });

    return new Response(JSON.stringify(connections), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(undefined, { status: error });
  }
}