import { url } from "$lib/guacAPI/url";

export async function tokensPOST(payload) {
  if (!payload || typeof (payload) != 'object' || !Object.keys(payload).length) {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  const response = await fetch(url + 'tokens', {
    method: 'POST',
    headers,
    body: new URLSearchParams(payload)
  });

  if (response.ok) {
    return { status: 201, data: await response.json() };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}

export async function tokensDELETE(deleteToken, authToken) {
  if (!deleteToken || typeof (deleteToken) != 'string' || deleteToken == '') {
    return { status: 400 }
  }
  if (!authToken || typeof (authToken) != 'string' || authToken == '') {
    return { status: 403 }
  }
  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  const response = await fetch(url + 'tokens/' + token, {
    method: 'DELETE',
    headers,
    body: new URLSearchParams({ token: authToken })
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
}