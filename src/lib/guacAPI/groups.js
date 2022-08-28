import { url } from "$lib/guacAPI/url";

export async function groupsGET(dataSource, token) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/userGroups?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 200, data: await response.json()};
}