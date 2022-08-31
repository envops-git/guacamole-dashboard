import cookie from 'cookie';
import { revokeConnectionFromGroupPATCH, assignConnectionToGroupPATCH, revokePermissionsFromGroupPATCH,  assignPermissionsToGroupPATCH, assignUserToGroupPATCH, groupsGET, groupsPOST, groupUsersGET, groupPermissionsGET, groupDELETE } from '../../../lib/guacAPI/groups';
import { revokeUserFromUserGroupPATCH } from '../../../lib/guacAPI/users'

export async function GET(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }
  try {
    const response = await groupsGET(cookies.dataSource, cookies.accessToken);
    if (response.status != 200) {
      return new Response(undefined, { status: response.status });
    }

    const groups = Object.keys(response.data);

    return new Response(JSON.stringify(groups), { status: 200 });
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
  const groupData = await event.request.json();

  if (!groupData || typeof (groupData) != 'object' || !groupData.groupName) {
    return new Response(undefined, { status: 400 });
  }
  try {
    const createRes = await groupsPOST(cookies.dataSource, cookies.accessToken, groupData.groupName);
    if (createRes.status != 201) {
      return new Response(undefined, { status: createRes.status });
    }
    const permissionsRes = await assignPermissionsToGroupPATCH(cookies.dataSource, cookies.accessToken, groupData.permissions, groupData.groupName);

    if (permissionsRes.status != 204) {
      return new Response(undefined, { status: permissionsRes.status });
    }

    if (groupData.users && groupData.users.length) {
      await Promise.all(groupData.users.map(async (user) => {
        assignUserToGroupPATCH(cookies.dataSource, cookies.accessToken, user.name, groupData.groupName);
      }))
    }
    if (groupData.connections && groupData.connections.length) {
      await Promise.all(groupData.connections.map(async (connection) => {
        assignConnectionToGroupPATCH(cookies.dataSource, cookies.accessToken, connection.id, groupData.groupName);
      }))
    }
    return new Response(undefined, { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(undefined, { status: error });
  }
}

export async function PUT(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }

  const groupData = await event.request.json();
  if (!groupData || typeof (groupData) != 'object' || !groupData.groupName) {
    return new Response(undefined, { status: 400 });
  }

  try {
    // Check group exists
    const response = await groupsGET(cookies.dataSource, cookies.accessToken);
    if (response.status != 200) {
      return new Response(undefined, { status: response.status });
    }
    const groups = Object.keys(response.data);

    if (!groups.includes(groupData.groupName)) {
      return new Response(undefined, { status: 400 });
    }

    //assign perms
    const revokeRes = await revokePermissionsFromGroupPATCH(cookies.dataSource, cookies.accessToken, {administer: true, createUsers: true, createGroups: true, createConnections: true}, groupData.groupName);
    if (revokeRes.status != 204) {
      return new Response(undefined, { status: permissionsRes.status });
    }
    const permissionsRes = await assignPermissionsToGroupPATCH(cookies.dataSource, cookies.accessToken, groupData.permissions, groupData.groupName);

    if (permissionsRes.status != 204) {
      return new Response(undefined, { status: permissionsRes.status });
    }

    //assign users
    const currentUsersRes = await groupUsersGET(cookies.dataSource, cookies.accessToken, groupData.groupName);

    if (currentUsersRes.status != 200) {
      return new Response(undefined, { status: currentUsersRes.status });
    }


    currentUsersRes.data.map(async (username) => {
      if (!groupData.users.filter(user => user.name == username).length) {
        const res = await revokeUserFromUserGroupPATCH(cookies.dataSource, cookies.accessToken, username, groupData.groupName);
        if (res.status != 204) {
          return new Response(undefined, { status: res.status });
        }
      }
    });

    groupData.users.map( async (user) => {
      if (!currentUsersRes.data.includes(user.name)) {
        const res = await assignUserToGroupPATCH(cookies.dataSource, cookies.accessToken, user.name, groupData.groupName);
        if (res.status != 204) {
          return new Response(undefined, { status: res.status });
        }
      }
    });

    //assign connections
    const permissionsResponse = await groupPermissionsGET(cookies.dataSource, cookies.accessToken, groupData.groupName);

    if (permissionsResponse.status != 200) {
      return new Response(undefined, { status: permissionsResponse.status });
    }

    let currentConnections = Object.keys(permissionsResponse.data.connectionPermissions);
    let newConnectionIDs = groupData.connections.map(connection => connection.id)

    currentConnections.map( async (id) => {
      if (!newConnectionIDs.includes(id)) {
        const res = await revokeConnectionFromGroupPATCH(cookies.dataSource, cookies.accessToken, id, groupData.groupName);
        if (res.status != 204) {
          return new Response(undefined, { status: res.status });
        }
      }
    });

    newConnectionIDs.map(async (id) => {
      if (!currentConnections.includes(id)) {
        const res = await assignConnectionToGroupPATCH(cookies.dataSource, cookies.accessToken, id, groupData.groupName);
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

export async function DELETE(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }

  const groupName = await event.request.text();

  if (!groupName || typeof (groupName) != 'string' || groupName == '') {
    return new Response(undefined, { status: 400 });
  }

  // Check group exists
  const response = await groupsGET(cookies.dataSource, cookies.accessToken);
  if (response.status != 200) {
    return new Response(undefined, { status: response.status });
  }
  const groups = Object.keys(response.data);

  if (!groups.includes(groupName)) {
    return new Response(undefined, { status: 400 });
  }

  const res = await groupDELETE(cookies.dataSource,cookies.accessToken, groupName);

  if (res.status != 204) {
    return new Response(undefined, { status: res.status });
  }
  return new Response(undefined, { status: 204 });
}