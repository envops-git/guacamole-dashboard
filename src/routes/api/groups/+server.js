import cookie from 'cookie';
import { assignConnectionToGroupPATCH, assignPermissionsToGroupPATCH, assignUserToGroupPATCH, groupsGET, groupsPOST } from '../../../lib/guacAPI/groups';


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

  if (!groupData || typeof(groupData) != 'object' || !groupData.groupName) {
    return new Response(undefined, { status: 400 });
  }

  try {
    const createRes = await groupsPOST(cookies.dataSource,cookies.accessToken, groupData.groupName);

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
        assignConnectionToGroupPATCH(cookies.dataSource, cookies.accessToken, connection.id , groupData.groupName);
      }))
    }

    return new Response(undefined, { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(undefined, { status: error });
  }
}