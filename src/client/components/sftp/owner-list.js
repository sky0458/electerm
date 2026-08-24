/**
 * get owner group/users list for local sessions.
 *
 * Remote SFTP sessions deliberately do not enumerate system accounts. The
 * SFTP protocol already provides numeric uid/gid values, and querying the
 * complete remote account database (for example via /etc/passwd or getent)
 * can be flagged as account-discovery activity by enterprise monitoring.
 *
 * for mac list users: `dscl . -list /Users UniqueID`
 * for mac list groups: `dscl . list /Groups PrimaryGroupID`
 * for linux list users: `cat /etc/passwd`
 * for linux list groups: `cat /etc/group`
 * for windows list users: do not know yet
 * for windows list groups: do not know yet
 */

import { isWin, isMac } from '../../common/constants'

function parseNames (str) {
  return str.split('\n')
    .reduce((p, d) => {
      const [name, , id] = d.split(':')
      return {
        ...p,
        [id + '']: name
      }
    }, {})
}

const linuxListUser = 'cat /etc/passwd'
const linuxListGroup = 'cat /etc/group'

export async function remoteListUsers () {
  return {}
}

export async function remoteListGroups () {
  return {}
}

export async function localListUsers () {
  if (isWin) {
    return {}
  } else if (isMac) {
    const g = await window.fs.run('dscl . -list /Users UniqueID')
      .catch(console.error)
    return g
      ? g.split('\n')
        .reduce((p, s) => {
          const [name, id] = s.split(/\s+/)
          if (!id) {
            return p
          }
          return {
            ...p,
            [id + '']: name
          }
        }, {})
      : {}
  } else {
    const g = await window.fs.run(linuxListUser).catch(console.error)
    return g
      ? parseNames(g)
      : {}
  }
}

export async function localListGroups () {
  if (isWin) {
    return {}
  } else if (isMac) {
    const g = await window.fs.run('dscl . list /Groups PrimaryGroupID')
      .catch(console.error)
    return g
      ? g.split('\n')
        .reduce((p, s) => {
          const [name, id] = s.split(/\s+/)
          return {
            ...p,
            [id + '']: name
          }
        }, {})
      : {}
  } else {
    const g = await window.fs.run(linuxListGroup).catch(console.error)
    return g
      ? parseNames(g)
      : {}
  }
}
