import { url } from "$lib/guacAPI/url";

export async function connectionsGET(dataSource, token) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/connections?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }

  }

  return { status: 200, data: await response.json() };
}

export async function connectionGET(dataSource, token, connectionID) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || !connectionID || typeof (connectionID) != 'string' || connectionID == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/connections/' + connectionID + '?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 200, data: await response.json() };
}

export async function connectionParametersGET(dataSource, token, connectionID) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || !connectionID || typeof (connectionID) != 'string' || connectionID == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/connections/' + connectionID + '/parameters?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 200, data: await response.json() };
}

export async function connectionHistoryGET(dataSource, token, connectionID) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || !connectionID || typeof (connectionID) != 'string' || connectionID == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/connections/' + connectionID + '/history?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 200, data: await response.json() };
}

export async function connectionSharingProfileGET(dataSource, token, connectionID) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || !connectionID || typeof (connectionID) != 'string' || connectionID == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/connections/' + connectionID + '/sharingProfiles?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 200, data: await response.json() };
}

export async function sharingProfilesGET(dataSource, token) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/sharingProfiles?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 200, data: await response.json() };
}

export async function activeConnectionsGET(dataSource, token) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/activeConnections?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 200, data: await response.json() };
}

export async function killActiveConnectionsPATCH(dataSource, token, activeConnectionID) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || !activeConnectionID || typeof(activeConnectionID) != 'string' || activeConnectionID == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-type', 'application/json');
  const response = await fetch(url + 'session/data/' + dataSource + '/activeConnections?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify([
      {
        "op": "remove",
        "path": "/" + activeConnectionID
      }
    ])
  });

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 204, data: await response.json() };
}