import { url } from "$lib/guacAPI/url";

export async function usersGET(dataSource, token) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/users?' + new URLSearchParams({ token }));

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function usersPOST(dataSource, token, userData) {
  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  if (!userData || !userData.username || !userData.password || typeof (userData.username) != 'string' || typeof (userData.password) != 'string' || userData.username == '' || userData.password == '') {
    return { status: 400 }
  }

  let requestBody = {
    "username": userData.username,
    "password": userData.password,
    "attributes": {
      "disabled": userData.attributes.disabled || '',
      "expired": userData.attributes.expired || '',
      "access-window-start": userData.attributes["access-window-start"] || '',
      "access-window-end": userData.attributes["access-window-end"] || '',
      "valid-from": userData.attributes["valid-from"] || '',
      "valid-until": userData.attributes["valid-until"] || '',
      "timezone": userData.attributes.timezone || null,
      "guac-full-name": userData.attributes["guac-full-name"] || '',
      "guac-organization": userData.attributes["guac-organization"] || '',
      "guac-organizational-role": userData.attributes["guac-organizational-role"] || '',
    }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const response = await fetch(url + 'session/data/' + dataSource + '/users?' + new URLSearchParams({ token }), {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  });

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function userDELETE(dataSource, token, username) {
  if (!dataSource || !token || !username || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || username == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '?' + new URLSearchParams({ token }), {
    method: 'DELETE'
  });

  if (response.ok) {
    return { status: 204, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function userGET(dataSource, token, username) {
  if (!dataSource || !token || !username || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || username == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '?' + new URLSearchParams({ token }));

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function selfGET(dataSource, token) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/self?' + new URLSearchParams({ token }));

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function userPermissionsGET(dataSource, token, username) {
  if (!dataSource || !token || !username || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || username == '') {
    return { status: 400 }
  }
  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '/permissions?' + new URLSearchParams({ token }));

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}


export async function userEffectivePermissionsGET(dataSource, token, username) {
  if (!dataSource || !token || !username || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || username == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '/effectivePermissions?' + new URLSearchParams({ token }));

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function userGroupsGET(dataSource, token, username) {
  if (!dataSource || !token || !username || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || username == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '/userGroups?' + new URLSearchParams({ token }));

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function userHistoryGET(dataSource, token, username) {
  if (!dataSource || !token || !username || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || username == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '/history?' + new URLSearchParams({ token }));

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function assignUserToUserGroupPATCH(dataSource, token, username, userGroup) {
  if (!dataSource || !token || !username || !userGroup || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || typeof (userGroup) != 'string' || dataSource == '' || token == '' || username == '' || userGroup == '') {
    return { status: 400 }
  }

  const pathArr = userGroup.split('/');

  const pathStr = '/';

  pathArr.forEach((segment, i) => {
    if (i != pathArr.length - 1) {
      pathStr = pathStr + segment + '/';
    }
  });

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '/userGroups?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify([
      {
        op: 'add',
        path: pathStr,
        value: pathArr[pathArr.length - 1]
      }
    ])
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function revokeUserFromUserGroupPATCH(dataSource, token, username, userGroup) {
  if (!dataSource || !token || !username || !userGroup || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || typeof (userGroup) != 'string' || dataSource == '' || token == '' || username == '' || userGroup == '') {
    return { status: 400 }
  }

  const pathArr = userGroup.split('/');

  const pathStr = '/';

  pathArr.forEach((segment, i) => {
    if (i != pathArr.length - 1) {
      pathStr = pathStr + segment + '/';
    }
  });

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '/userGroups?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify([
      {
        op: 'remove',
        path: pathStr,
        value: pathArr[pathArr.length - 1]
      }
    ])
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function assignUserToConnectionPATCH(dataSource, token, username, connectionID) {
  if (!dataSource || !token || !username || !connectionID || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || typeof (connectionID) != 'string' || dataSource == '' || token == '' || username == '' || connectionID == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '/permissions?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify([
      {
        op: 'add',
        path: "/connectionPermissions/" + connectionID,
        value: "READ"
      }
    ])
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function assignUserToConnectionGroupPATCH(dataSource, token, username, connectionGroupID) {
  if (!dataSource || !token || !username || !connectionGroupID || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || typeof (connectionGroupID) != 'string' || dataSource == '' || token == '' || username == '' || connectionGroupID == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '/permissions?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify([
      {
        op: 'add',
        path: "/connectionGroupPermissions/" + connectionGroupID,
        value: "READ"
      }
    ])
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function revokeUserFromConnectionPATCH(dataSource, token, username, connectionID) {
  if (!dataSource || !token || !username || !connectionID || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || typeof (connectionID) != 'string' || dataSource == '' || token == '' || username == '' || connectionID == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '/permissions?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify([
      {
        op: 'remove',
        path: "/connectionPermissions/" + connectionID,
        value: "READ"
      }
    ])
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function revokeUserFromConnectionGroupPATCH(dataSource, token, username, connectionGroupID) {
  if (!dataSource || !token || !username || !connectionGroupID || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || typeof (connectionGroupID) != 'string' || dataSource == '' || token == '' || username == '' || connectionGroupID == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '/permissions?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify([
      {
        op: 'remove',
        path: "/connectionGroupPermissions/" + connectionGroupID,
        value: "READ"
      }
    ])
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function userUpdatePasswordPUT(dataSource, token, username, oldPassword, newPassword) {
  if (!dataSource || !token || !username || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || username == '') {
    return { status: 400 }
  }

  if (!oldPassword || !newPassword || typeof (oldPassword) != 'string' || typeof (newPassword) != 'string' || oldPassword == '' || newPassword == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '/password?' + new URLSearchParams({ token }), {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      oldPassword,
      newPassword
    })
  });
  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function userUpdatePUT(dataSource, token, username, data) {
  if (!dataSource || !token || !username || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || username == '') {
    return { status: 400 }
  }

  if (!data || typeof (data) != 'object') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '?' + new URLSearchParams({ token }), {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}