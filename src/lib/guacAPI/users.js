import { url } from "$lib/guacAPI/url";

export async function usersGET(dataSource, token) {

  if (!dataSource || !token || typeof(dataSource) != 'string' || typeof(token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  const response = await fetch(url + 'session/data/' + dataSource + '/users', {
    method: 'GET',
    headers,
    body: new URLSearchParams({token})
  });

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function userGET(dataSource, token, username) {
  if (!dataSource || !token || !username || typeof(dataSource) != 'string' || typeof(username) != 'string' || typeof(token) != 'string' || dataSource == '' || token == '' || username == '') {
    return { status: 400 }
  }
  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username, {
    method: 'GET',
    headers,
    body: new URLSearchParams({token})
  });

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function selfGET(dataSource, token) {

  if (!dataSource || !token || typeof(dataSource) != 'string' || typeof(token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  const response = await fetch(url + 'session/data/' + dataSource + '/self', {
    method: 'GET',
    headers,
    body: new URLSearchParams({token})
  });

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function userEffectivePermissionsGET(dataSource, token, username){
  if (!dataSource || !token || !username || typeof(dataSource) != 'string' || typeof(username) != 'string' || typeof(token) != 'string' || dataSource == '' || token == '' || username == '') {
    return { status: 400 }
  }
  
  const response = await fetch(url + 'session/data/' + dataSource + '/users/' + username + '/effectivePermissions?' + new URLSearchParams({token}));

  if (response.ok) {
    return { status: 200, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}