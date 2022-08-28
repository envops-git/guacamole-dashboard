import cookie from 'cookie';
import { usersGET } from '../../../lib/guacAPI/users';


export async function GET(event) {
  const cookies = cookie.parse((await event.request.headers.get('cookie')) || '');
  if (!cookies.dataSource || !cookies.accessToken) {
    return new Response(undefined, { status: 403 });
  }
  try {
    const response = await usersGET(cookies.dataSource, cookies.accessToken);
    if (response.status != 200) {
      return new Response(undefined, { status: response.status });
    }
    const users = Object.keys(response.data);
    
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(undefined, { status: error });
  }
}