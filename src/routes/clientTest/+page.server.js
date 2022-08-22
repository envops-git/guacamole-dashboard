import encrypt from "../../lib/encrypt";

export async function load() {
  let token = encrypt({
    connection: {
      type: 'rdp',
      settings: {
        hostname: 'ec2-54-87-66-8.compute-1.amazonaws.com', // Replace with IP
        port: '32424',
        username: 'guacadmin',
        password: 'guacadmin',
        'disable-auth': true,
        security: 'any',
        'ignore-cert': true,
        'enable-wallpaper': false
      }
    }
  });

  return {
    token,
  }
}