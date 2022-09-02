import cookie from 'cookie';
import { connectionsGET, createRDPconnectionPOST, createSSHconnectionPOST, createVNCconnectionPOST, connectionDELETE, updateRDPconnectionPUT, updateSSHconnectionPUT, updateVNCconnectionPUT } from '../../../lib/guacAPI/connections';


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

export async function POST(event){
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }
  try {
    const connectionData = await event.request.json();
    if (!connectionData || !connectionData.connectionName || connectionData.connectionName == '' || !connectionData.protocol) {
      return new Response(undefined, {status: 400});
    }
    
    if(!(connectionData.protocol == 'SSH' ||  connectionData.protocol == 'RDP' || connectionData.protocol == 'VNC')){
      return new Response(undefined, {status: 400});
    }

    if (connectionData.protocol == 'RDP') {
      const response = await createRDPconnectionPOST(cookies.dataSource, cookies.accessToken, connectionData);
      if (response.status != 201) {
        return new Response(undefined, { status: response.status });
      }
      return new Response(undefined, { status: 201 });
    }

    if (connectionData.protocol == 'SSH') {
      const response = await createSSHconnectionPOST(cookies.dataSource, cookies.accessToken, connectionData);
      if (response.status != 201) {
        return new Response(undefined, { status: response.status });
      }
      return new Response(undefined, { status: 201 });
    }

    if (connectionData.protocol == 'VNC') {
      const response = await createVNCconnectionPOST(cookies.dataSource, cookies.accessToken, connectionData);
      if (response.status != 201) {
        return new Response(undefined, { status: response.status });
      }
      return new Response(undefined, { status: 201 });
    }

  } catch (error) {
    console.log(error);
    return new Response(undefined, { status: 500 });
  }
}

export async function DELETE(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }

  const connectionID = await event.request.text();

  if (!connectionID || typeof (connectionID) != 'string' || connectionID == '') {
    return new Response(undefined, { status: 400 });
  }

  // Check group exists
  const res = await connectionDELETE(cookies.dataSource,cookies.accessToken, connectionID);

  if (res.status != 204) {
    return new Response(undefined, { status: res.status });
  }
  return new Response(undefined, { status: 204 });
}

export async function PUT(event){
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }
  try {
    const connectionData = await event.request.json();
    if (!connectionData || !connectionData.connectionName || !connectionData.connectionID || connectionData.connectionName == '' || connectionData.connectionID == '' || !connectionData.protocol) {
      return new Response(undefined, {status: 400});
    }
    
    if(!(connectionData.protocol == 'SSH' ||  connectionData.protocol == 'RDP' || connectionData.protocol == 'VNC')){
      return new Response(undefined, {status: 400});
    }

    if (connectionData.protocol == 'RDP') {
      const response = await updateRDPconnectionPUT(cookies.dataSource, cookies.accessToken, connectionData);
      if (response.status != 204) {
        return new Response(undefined, { status: response.status });
      }
      return new Response(undefined, { status: 204 });
    }

    if (connectionData.protocol == 'SSH') {
      const response = await updateSSHconnectionPUT(cookies.dataSource, cookies.accessToken, connectionData);
      if (response.status != 204) {
        return new Response(undefined, { status: response.status });
      }
      return new Response(undefined, { status: 204 });
    }

    if (connectionData.protocol == 'VNC') {
      const response = await updateVNCconnectionPUT(cookies.dataSource, cookies.accessToken, connectionData);
      if (response.status != 204) {
        return new Response(undefined, { status: response.status });
      }
      return new Response(undefined, { status: 204 });
    }

  } catch (error) {
    console.log(error);
    return new Response(undefined, { status: 500 });
  }
}