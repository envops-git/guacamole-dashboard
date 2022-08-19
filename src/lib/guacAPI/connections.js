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