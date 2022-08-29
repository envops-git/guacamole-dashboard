import { url } from "$lib/guacAPI/url";

export async function groupsGET(dataSource, token) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/userGroups?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 200, data: await response.json() };
}

export async function groupsPOST(dataSource, token, groupName) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  const response = await fetch(url + 'session/data/' + dataSource + '/userGroups?' + new URLSearchParams({ token }), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      "identifier": groupName,
      "attributes": {
        "disabled": ""
      }
    })
  });

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 201 };
}

export async function groupGET(dataSource, token, groupName) {
  if (!dataSource || !token || !groupName || typeof (dataSource) != 'string' || typeof (groupName) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || groupName == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/userGroups/' + groupName + '?' + new URLSearchParams({ token }));

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function assignUserToGroupPATCH(dataSource, token, username, groupName) {
  if (!dataSource || !token || !username || !groupName || typeof (dataSource) != 'string' || typeof (username) != 'string' || typeof (token) != 'string' || typeof (groupName) != 'string' || dataSource == '' || token == '' || username == '' || groupName == '') {
    return { status: 400 }
  }

  const pathArr = groupName.split('/');

  const pathStr = '/';

  pathArr.forEach((segment, i) => {
    if (i != pathArr.length - 1) {
      pathStr = pathStr + segment + '/';
    }
  });

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/userGroups/' + groupName + '/memberUsers?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify([
      {
        op: 'add',
        path: pathStr,
        value: username
      }
    ])
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return Promise.reject({ status: 500 })
  }
  return Promise.reject({ status: 403 })
}

export async function assignPermissionsToGroupPATCH(dataSource, token, permissions, groupName) {
  if (!dataSource || !token || !permissions || !groupName || typeof (dataSource) != 'string' || typeof (permissions) != 'object' || typeof (token) != 'string' || typeof (groupName) != 'string' || dataSource == '' || token == '' || groupName == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  if (permissions.administer != true
    && permissions.createUsers != true
    && permissions.createGroups != true
    && permissions.createConnections != true) {
    return { status: 204 };
  }

  let body = [{
    "op": "add",
    "path": "/connectionPermissions/" + groupName,
    "value": "READ"
  }]

  if (permissions.administer) {
    body.push({
      "op": "add",
      "path": "/systemPermissions",
      "value": "ADMINISTER"
    });
  }

  if (permissions.createUsers) {
    body.push({
      "op": "add",
      "path": "/systemPermissions",
      "value": "CREATE_USER"
    });
  }

  if (permissions.createGroups) {
    body.push({
      "op": "add",
      "path": "/systemPermissions",
      "value": "CREATE_USER_GROUP"
    });
  }

  if (permissions.createConnections) {
    body.push({
      "op": "add",
      "path": "/systemPermissions",
      "value": "CREATE_CONNECTION"
    });
  }


  const response = await fetch(url + 'session/data/' + dataSource + '/userGroups/' + groupName + '/permissions?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body)
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function revokePermissionsFromGroupPATCH(dataSource, token, permissions, groupName) {
  if (!dataSource || !token || !permissions || !groupName || typeof (dataSource) != 'string' || typeof (permissions) != 'object' || typeof (token) != 'string' || typeof (groupName) != 'string' || dataSource == '' || token == '' || groupName == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  if (permissions.administer != true
    && permissions.createUsers != true
    && permissions.createGroups != true
    && permissions.createConnections != true) {
    return { status: 204 };
  }

  let body = [{
    "op": "remove",
    "path": "/connectionPermissions/" + groupName,
    "value": "READ"
  }]

  if (permissions.administer) {
    body.push({
      "op": "remove",
      "path": "/systemPermissions",
      "value": "ADMINISTER"
    });
  }

  if (permissions.createUsers) {
    body.push({
      "op": "remove",
      "path": "/systemPermissions",
      "value": "CREATE_USER"
    });
  }

  if (permissions.createGroups) {
    body.push({
      "op": "remove",
      "path": "/systemPermissions",
      "value": "CREATE_USER_GROUP"
    });
  }

  if (permissions.createConnections) {
    body.push({
      "op": "remove",
      "path": "/systemPermissions",
      "value": "CREATE_CONNECTION"
    });
  }


  const response = await fetch(url + 'session/data/' + dataSource + '/userGroups/' + groupName + '/permissions?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body)
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function assignConnectionToGroupPATCH(dataSource, token, connectionID, groupName) {
  if (!dataSource || !token || !connectionID || !groupName || typeof (dataSource) != 'string' || typeof (connectionID) != 'string' || typeof (token) != 'string' || typeof (groupName) != 'string' || dataSource == '' || connectionID == '' || token == '' || groupName == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/userGroups/' + groupName + '/permissions?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify([{
      "op": "add",
      "path": "/connectionPermissions/" + connectionID,
      "value": "READ"
    }])
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function revokeConnectionFromGroupPATCH(dataSource, token, connectionID, groupName) {
  if (!dataSource || !token || !connectionID || !groupName || typeof (dataSource) != 'string' || typeof (connectionID) != 'string' || typeof (token) != 'string' || typeof (groupName) != 'string' || dataSource == '' || connectionID == '' || token == '' || groupName == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/userGroups/' + groupName + '/permissions?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify([{
      "op": "remove",
      "path": "/connectionPermissions/" + connectionID,
      "value": "READ"
    }])
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function groupDELETE(dataSource, token, groupName) {
  if (!dataSource || !token || !groupName || typeof (dataSource) != 'string' || typeof (groupName) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || groupName == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/userGroups/' + groupName + '?' + new URLSearchParams({ token }), {
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