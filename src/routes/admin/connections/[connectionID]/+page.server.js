import cookie from 'cookie';
import { redirect } from '@sveltejs/kit';
import { connectionGET, connectionParametersGET } from "../../../../lib/guacAPI/connections";

export async function load({ params, request }) {
  const cookies = cookie.parse((await request.headers.get('cookie')) || '');
  const connectionID = params.connectionID;

  const connectionRes = await connectionGET(cookies.dataSource, cookies.accessToken, connectionID);

  if (connectionRes.status != 200) {
    throw redirect(302, '/admin/connections');
  }

  const parametersRes = await connectionParametersGET(cookies.dataSource, cookies.accessToken, connectionID);

  if (parametersRes.status != 200) {
    throw redirect(302, '/admin/connections');
  }

  let connectionData = {
    connectionName: connectionRes.data.name,
    protocol: connectionRes.data.protocol.toUpperCase(),
    hostname: parametersRes.data.hostname || '',
    port: parametersRes.data.port || '',
    sshPublicKey: connectionRes.data.protocol == 'SSH' ? parametersRes.data['host-key'] || '' : parametersRes.data['sftp-host-key'] || '',
    sshPrivateKey: connectionRes.data.protocol == 'SSH' ? parametersRes.data['private-key'] || '' : parametersRes.data['sftp-private-key'] || '',
    sshPassphrase: connectionRes.data.protocol == 'SSH' ? parametersRes.data['passphrase'] || '' : parametersRes.data['sftp-passphrase'] || '',
    username: parametersRes.data.username || '',
    password: parametersRes.data.password || '',
    domain: parametersRes.data.domain || '',
    securityMode: parametersRes.data.security || 'any',
    disableAuth: parametersRes.data['disable-auth'] == 'true' ? true : false,
    ignoreCert: parametersRes.data['ignore-cert'] == 'true' ? true : false,
    maxNumberConnections: connectionRes.data.attributes['max-connections'] || '',
    maxNumberConnectionsPerUser: connectionRes.data.attributes['max-connections-per-user'] || '',
    enableSFTP: parametersRes.data['enable-sftp'] == 'true' ? true : false,
    sftpHostname: parametersRes.data['sftp-hostname'] || '',
    sftpPort: parametersRes.data['sftp-port'] || '',
    sftpKeepAlive: parametersRes.data['sftp-server-alive-interval'] || '',
    sftpRootDirectory: parametersRes.data['sftp-root-directory'] || '',
    sftpUsername: parametersRes.data['sftp-username'] || '',
    sftpPassword: parametersRes.data['sftp-password'] || '',
  }

  return connectionData;
}

