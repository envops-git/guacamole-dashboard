// import { GUAC_API_URL } from '$env/static/private'

export const url = 'https://test.envops.com/guacamole/api/';
 
export function getClientURL(connectionID, dataSource, token){
  const connectionStr = btoa(
    [connectionID, 'c', dataSource].join('\0')
  );
  return 'https://test.envops.com/guacamole/#/client/' + encodeURIComponent(connectionStr) + '?' + new URLSearchParams({token});
}