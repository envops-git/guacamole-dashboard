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

export async function connectionDELETE(dataSource, token, connectionID) {
  if (!dataSource || !token || !connectionID || typeof (dataSource) != 'string' || typeof (connectionID) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || connectionID == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/connections/' + connectionID + '?' + new URLSearchParams({ token }), {
    method: 'DELETE'
  });

  if (response.ok) {
    return { status: 204 };
  }

  if (response.status == 500) {
    return { status: 500 }
  }
  return { status: 403 }
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

export async function connectionHistoryGET(dataSource, token, connectionID) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || !connectionID || typeof (connectionID) != 'string' || connectionID == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/connections/' + connectionID + '/history?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 200, data: await response.json() };
}

export async function connectionSharingProfileGET(dataSource, token, connectionID) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || !connectionID || typeof (connectionID) != 'string' || connectionID == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/connections/' + connectionID + '/sharingProfiles?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 200, data: await response.json() };
}

export async function sharingProfilesGET(dataSource, token) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/sharingProfiles?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 200, data: await response.json() };
}

export async function activeConnectionsGET(dataSource, token) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  const response = await fetch(url + 'session/data/' + dataSource + '/activeConnections?' + new URLSearchParams({ token }));

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 200, data: await response.json() };
}

export async function killActiveConnectionPATCH(dataSource, token, activeConnectionID) {

  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '' || !activeConnectionID || typeof (activeConnectionID) != 'string' || activeConnectionID == '') {
    return { status: 400 }
  }

  const headers = new Headers();
  headers.append('Content-type', 'application/json');
  const response = await fetch(url + 'session/data/' + dataSource + '/activeConnections?' + new URLSearchParams({ token }), {
    method: 'PATCH',
    headers,
    body: JSON.stringify([
      {
        "op": "remove",
        "path": "/" + activeConnectionID
      }
    ])
  });

  if (!response.ok) {
    return Promise.reject({ status: response.status });
  }

  return { status: 204, data: await response.json() };
}

export async function createRDPconnectionPOST(dataSource, token, connectionData) {
  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  if (!connectionData || !connectionData.connectionName || connectionData.connectionName == '') {
    return { status: 400 }
  }

  const body = {
    "parentIdentifier": "ROOT",
    "name": connectionData.connectionName,
    "protocol": "rdp",
    "parameters": {
      "port": connectionData.port ? connectionData.port : '',
      "enable-sftp": connectionData.enableSFTP ? "true" : "",
      "sftp-port": connectionData.sftpPort ? `${connectionData.sftpPort}` : "",
      "sftp-server-alive-interval": connectionData.sftpKeepAlive ? `${connectionData.sftpKeepAlive}` : "",
      "security": connectionData.security ? connectionData.security : "any",
      "disable-auth": connectionData.disableAuth ? "true": "false",
      "ignore-cert": connectionData.ignoreCert ? "true": "false",
      "hostname": connectionData.hostname ? connectionData.hostname : '',
      "username": connectionData.username ? connectionData.username : '',
      "password": connectionData.password ? connectionData.password : '',
      "domain": connectionData.domain ? connectionData.domain : '',
      "sftp-hostname": connectionData.sftpHostname ? connectionData.sftpHostname : '',
      "sftp-host-key": connectionData.sshPublicKey ? connectionData.sshPublicKey : '',
      "sftp-username": connectionData.sftpUsername ? connectionData.sftpUsername : '',
      "sftp-password": connectionData.sftpPassword ? connectionData.sftpPassword : '',
      "sftp-private-key": connectionData.sshPrivateKey ? connectionData.sshPrivateKey : '',
      "sftp-passphrase": connectionData.sshPassphrase ? connectionData.sshPassphrase : '',
      "sftp-root-directory": connectionData.sftpRootDirectory ? connectionData.sftpRootDirectory : '',
    },
    "attributes": {
      "max-connections": connectionData.maxNumberConnections ? connectionData.maxNumberConnections : '',
      "max-connections-per-user": connectionData.maxNumberConnectionsPerUser ? connectionData.maxNumberConnectionsPerUser : '',
    }
  };

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/connections?' + new URLSearchParams({ token }), {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 201 };
}

export async function createSSHconnectionPOST(dataSource, token, connectionData) {
  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  if (!connectionData || !connectionData.connectionName || connectionData.connectionName == '') {
    return { status: 400 }
  }

  const body = {
    "parentIdentifier": "ROOT",
    "name": connectionData.connectionName,
    "protocol": "ssh",
    "parameters": {
      "port": connectionData.port ? connectionData.port : '',
      "enable-sftp": connectionData.enableSFTP ? "true" : "",
      "sftp-port": "",
      "sftp-server-alive-interval": connectionData.sftpKeepAlive ? `${connectionData.sftpKeepAlive}` : "",
      "hostname": connectionData.hostname ? connectionData.hostname : '',
      "host-key": connectionData.sshPublicKey ? connectionData.sshPublicKey : '',
      "private-key": connectionData.sshPrivateKey ? connectionData.sshPrivateKey : '',
      "username": connectionData.username ? connectionData.username : '',
      "password": connectionData.password ? connectionData.password : '',
      "passphrase": connectionData.sshPassphrase ? connectionData.sshPassphrase : '',
      "sftp-root-directory": connectionData.sftpRootDirectory ? connectionData.sftpRootDirectory : '',
    },
    "attributes": {
      "max-connections": connectionData.maxNumberConnections ? connectionData.maxNumberConnections : '',
      "max-connections-per-user": connectionData.maxNumberConnectionsPerUser ? connectionData.maxNumberConnectionsPerUser : '',
    }
  };

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/connections?' + new URLSearchParams({ token }), {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 201 };
}

export async function createVNCconnectionPOST(dataSource, token, connectionData) {
  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  if (!connectionData || !connectionData.connectionName || connectionData.connectionName == '') {
    return { status: 400 }
  }

  const body = {
    "parentIdentifier": "ROOT",
    "name": connectionData.connectionName,
    "protocol": "vnc",
    "parameters": {
      "port": connectionData.port ? connectionData.port : '',
      "enable-sftp": connectionData.enableSFTP ? "true" : "",
      "sftp-port": connectionData.sftpPort ? `${connectionData.sftpPort}` : "",
      "sftp-server-alive-interval": connectionData.sftpKeepAlive ? `${connectionData.sftpKeepAlive}` : "",
      "sftp-private-key": connectionData.sshPrivateKey ? connectionData.sshPrivateKey : '',
      "sftp-passphrase": connectionData.sshPassphrase ? connectionData.sshPassphrase : '',
      "sftp-root-directory": connectionData.sftpRootDirectory ? connectionData.sftpRootDirectory : '',
      "sftp-hostname": connectionData.sftpHostname ? connectionData.sftpHostname : '',
      "sftp-host-key": connectionData.sshPublicKey ? connectionData.sshPublicKey : '',
      "sftp-username": connectionData.sftpUsername ? connectionData.sftpUsername : '',
      "sftp-password": connectionData.sftpPassword ? connectionData.sftpPassword : '',
      "hostname": connectionData.hostname ? connectionData.hostname : '',
      "username": connectionData.username ? connectionData.username : '',
      "password": connectionData.password ? connectionData.password : '',
    },
    "attributes": {
      "max-connections": connectionData.maxNumberConnections ? connectionData.maxNumberConnections : '',
      "max-connections-per-user": connectionData.maxNumberConnectionsPerUser ? connectionData.maxNumberConnectionsPerUser : '',
    }
  };

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/connections?' + new URLSearchParams({ token }), {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 201 };
}

export async function updateRDPconnectionPUT(dataSource, token, connectionData) {
  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  if (!connectionData || !connectionData.connectionName || connectionData.connectionName == '' || !connectionData.connectionID || connectionData.connectionID == '' || typeof(connectionData.connectionID) != 'string') {
    return { status: 400 }
  }

  const body = {
    "parentIdentifier": "ROOT",
    "name": connectionData.connectionName,
    "protocol": "rdp",
    "parameters": {
      "port": connectionData.port ? connectionData.port : '',
      "enable-sftp": connectionData.enableSFTP ? "true" : "",
      "sftp-port": connectionData.sftpPort ? `${connectionData.sftpPort}` : "",
      "sftp-server-alive-interval": connectionData.sftpKeepAlive ? `${connectionData.sftpKeepAlive}` : "",
      "security": connectionData.security ? connectionData.security : "any",
      "disable-auth": connectionData.disableAuth ? "true": "false",
      "ignore-cert": connectionData.ignoreCert ? "true": "false",
      "hostname": connectionData.hostname ? connectionData.hostname : '',
      "username": connectionData.username ? connectionData.username : '',
      "password": connectionData.password ? connectionData.password : '',
      "domain": connectionData.domain ? connectionData.domain : '',
      "sftp-hostname": connectionData.sftpHostname ? connectionData.sftpHostname : '',
      "sftp-host-key": connectionData.sshPublicKey ? connectionData.sshPublicKey : '',
      "sftp-username": connectionData.sftpUsername ? connectionData.sftpUsername : '',
      "sftp-password": connectionData.sftpPassword ? connectionData.sftpPassword : '',
      "sftp-private-key": connectionData.sshPrivateKey ? connectionData.sshPrivateKey : '',
      "sftp-passphrase": connectionData.sshPassphrase ? connectionData.sshPassphrase : '',
      "sftp-root-directory": connectionData.sftpRootDirectory ? connectionData.sftpRootDirectory : '',
    },
    "attributes": {
      "max-connections": connectionData.maxNumberConnections ? connectionData.maxNumberConnections : '',
      "max-connections-per-user": connectionData.maxNumberConnectionsPerUser ? connectionData.maxNumberConnectionsPerUser : '',
    }
  };

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/connections/' + connectionData.connectionID + '?' + new URLSearchParams({ token }), {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 204 };
}


export async function updateSSHconnectionPUT(dataSource, token, connectionData) {
  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  if (!connectionData || !connectionData.connectionName || connectionData.connectionName == '' || !connectionData.connectionID || connectionData.connectionID == '' || typeof(connectionData.connectionID) != 'string') {
    return { status: 400 }
  }

  const body = {
    "parentIdentifier": "ROOT",
    "name": connectionData.connectionName,
    "protocol": "ssh",
    "parameters": {
      "port": connectionData.port ? connectionData.port : '',
      "enable-sftp": connectionData.enableSFTP ? "true" : "",
      "sftp-port": "",
      "sftp-server-alive-interval": connectionData.sftpKeepAlive ? `${connectionData.sftpKeepAlive}` : "",
      "hostname": connectionData.hostname ? connectionData.hostname : '',
      "host-key": connectionData.sshPublicKey ? connectionData.sshPublicKey : '',
      "private-key": connectionData.sshPrivateKey ? connectionData.sshPrivateKey : '',
      "username": connectionData.username ? connectionData.username : '',
      "password": connectionData.password ? connectionData.password : '',
      "passphrase": connectionData.sshPassphrase ? connectionData.sshPassphrase : '',
      "sftp-root-directory": connectionData.sftpRootDirectory ? connectionData.sftpRootDirectory : '',
    },
    "attributes": {
      "max-connections": connectionData.maxNumberConnections ? connectionData.maxNumberConnections : '',
      "max-connections-per-user": connectionData.maxNumberConnectionsPerUser ? connectionData.maxNumberConnectionsPerUser : '',
    }
  };

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/connections/' + connectionData.connectionID + '?' + new URLSearchParams({ token }), {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 204 };
}

export async function updateVNCconnectionPUT(dataSource, token, connectionData) {
  if (!dataSource || !token || typeof (dataSource) != 'string' || typeof (token) != 'string' || dataSource == '' || token == '') {
    return { status: 400 }
  }

  if (!connectionData || !connectionData.connectionName || connectionData.connectionName == '' || !connectionData.connectionID || connectionData.connectionID == '' || typeof(connectionData.connectionID) != 'string') {
    return { status: 400 }
  }

  const body = {
    "parentIdentifier": "ROOT",
    "name": connectionData.connectionName,
    "protocol": "vnc",
    "parameters": {
      "port": connectionData.port ? connectionData.port : '',
      "enable-sftp": connectionData.enableSFTP ? "true" : "",
      "sftp-port": connectionData.sftpPort ? `${connectionData.sftpPort}` : "",
      "sftp-server-alive-interval": connectionData.sftpKeepAlive ? `${connectionData.sftpKeepAlive}` : "",
      "sftp-private-key": connectionData.sshPrivateKey ? connectionData.sshPrivateKey : '',
      "sftp-passphrase": connectionData.sshPassphrase ? connectionData.sshPassphrase : '',
      "sftp-root-directory": connectionData.sftpRootDirectory ? connectionData.sftpRootDirectory : '',
      "sftp-hostname": connectionData.sftpHostname ? connectionData.sftpHostname : '',
      "sftp-host-key": connectionData.sshPublicKey ? connectionData.sshPublicKey : '',
      "sftp-username": connectionData.sftpUsername ? connectionData.sftpUsername : '',
      "sftp-password": connectionData.sftpPassword ? connectionData.sftpPassword : '',
      "hostname": connectionData.hostname ? connectionData.hostname : '',
      "username": connectionData.username ? connectionData.username : '',
      "password": connectionData.password ? connectionData.password : '',
    },
    "attributes": {
      "max-connections": connectionData.maxNumberConnections ? connectionData.maxNumberConnections : '',
      "max-connections-per-user": connectionData.maxNumberConnectionsPerUser ? connectionData.maxNumberConnectionsPerUser : '',
    }
  };

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const response = await fetch(url + 'session/data/' + dataSource + '/connections/' + connectionData.connectionID + '?' + new URLSearchParams({ token }), {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return { status: response.status }
  }

  return { status: 204 };
}