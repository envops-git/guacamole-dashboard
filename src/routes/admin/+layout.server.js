import { redirect } from "@sveltejs/kit";

export async function load({ url }) {
  if (url.pathname == '/admin') {
    throw redirect(302, '/admin/activeSessions');
  }
}