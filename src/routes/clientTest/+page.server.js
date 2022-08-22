import encrypt from "../../lib/encrypt";

export async function load() {
  let token = encrypt({
    connection: {
      type: 'rdp',
      settings: {
        hostname: 'ec2-54-87-66-8.compute-1.amazonaws.com:32424', // Replace with IP
        username: 'guacadmin',
        password: 'guacadmin',
        'enable-drive': true,
        'create-drive-path': true,
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