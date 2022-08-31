import cookie from 'cookie';
import { assignPermissionsToUserPATCH, usersGET, usersPOST, assignUserToConnectionPATCH, userDELETE, revokePermissionsFromUserPATCH, userPermissionsGET, revokeUserFromConnectionPATCH } from '../../../lib/guacAPI/users';


export async function GET(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }
  try {
    const response = await usersGET(cookies.dataSource, cookies.accessToken);
    if (response.status != 200) {
      return new Response(undefined, { status: response.status });
    }
    const users = Object.keys(response.data);

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(undefined, { status: error });
  }
}

export async function POST(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }
  const userData = await event.request.json();

  if (!userData || typeof (userData) != 'object' || !userData.username || !userData.password) {
    return new Response(undefined, { status: 400 });
  }
  try {
    const createRes = await usersPOST(cookies.dataSource, cookies.accessToken, { username: userData.username, password: userData.password });
    if (createRes.status != 201) {
      return new Response(undefined, { status: createRes.status });
    }
    const permissionsRes = await assignPermissionsToUserPATCH(cookies.dataSource, cookies.accessToken, userData.permissions, userData.username);

    if (permissionsRes.status != 204) {
      return new Response(undefined, { status: permissionsRes.status });
    }

    if (userData.connections && userData.connections.length) {
      await Promise.all(userData.connections.map(async (connection) => {
        assignUserToConnectionPATCH(cookies.dataSource, cookies.accessToken, userData.username, connection.id);
      }))
    }
    return new Response(undefined, { status: 201 });
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

  const username = await event.request.text();

  if (!username || typeof (username) != 'string' || username == '') {
    return new Response(undefined, { status: 400 });
  }

  // Check group exists
  const response = await usersGET(cookies.dataSource, cookies.accessToken);
  if (response.status != 200) {
    return new Response(undefined, { status: response.status });
  }

  const users = Object.keys(response.data);

  if (!users.includes(username)) {
    return new Response(undefined, { status: 400 });
  }

  const res = await userDELETE(cookies.dataSource, cookies.accessToken, username);

  if (res.status != 204) {
    return new Response(undefined, { status: res.status });
  }
  return new Response(undefined, { status: 204 });
}

export async function PUT(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }

  const userData = await event.request.json();
  if (!userData || typeof (userData) != 'object' || !userData.username) {
    return new Response(undefined, { status: 400 });
  }

  try {
    // Check group exists
    const response = await usersGET(cookies.dataSource, cookies.accessToken);
    if (response.status != 200) {
      return new Response(undefined, { status: response.status });
    }
    const users = Object.keys(response.data);

    if (!users.includes(userData.username)) {
      return new Response(undefined, { status: 400 });
    }

    //assign perms
    const revokeRes = await revokePermissionsFromUserPATCH(cookies.dataSource, cookies.accessToken, {administer: true, createUsers: true, createGroups: true, createConnections: true}, userData.username);
    if (revokeRes.status != 204) {
      return new Response(undefined, { status: permissionsRes.status });
    }
    const permissionsRes = await assignPermissionsToUserPATCH(cookies.dataSource, cookies.accessToken, userData.permissions, userData.username);

    if (permissionsRes.status != 204) {
      return new Response(undefined, { status: permissionsRes.status });
    }

    //assign connections
    const permissionsResponse = await userPermissionsGET(cookies.dataSource, cookies.accessToken, userData.username);

    if (permissionsResponse.status != 200) {
      return new Response(undefined, { status: permissionsResponse.status });
    }

    let currentConnections = Object.keys(permissionsResponse.data.connectionPermissions);
    let newConnectionIDs = userData.connections.map(connection => connection.id)

    currentConnections.map( async (id) => {
      if (!newConnectionIDs.includes(id)) {
        const res = await revokeUserFromConnectionPATCH(cookies.dataSource, cookies.accessToken, userData.username, id);
        if (res.status != 204) {
          return new Response(undefined, { status: res.status });
        }
      }
    });

    newConnectionIDs.map(async (id) => {
      if (!currentConnections.includes(id)) {
        const res = await assignUserToConnectionPATCH(cookies.dataSource, cookies.accessToken, userData.username, id );
        if (res.status != 204) {
          return new Response(undefined, { status: res.status });
        }
      }
    });

    return new Response(undefined, { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(undefined, { status: error });
  }
}