/**
 * terminal apis
 */

import fetch from '../../common/fetch-from-server'

const authenticationFailurePatterns = [
  /all configured authentication methods failed/i,
  /authentication (?:failed|failure)/i,
  /unable to authenticate/i,
  /permission denied/i,
  /too many authentication failures/i,
  /no authentication methods available/i
]

function isAuthenticationFailure (err) {
  const message = typeof err === 'string' ? err : err?.message
  return authenticationFailurePatterns.some(pattern => pattern.test(message || ''))
}

export function createTerm (body) {
  return fetch({
    body,
    action: 'create-terminal'
  }).catch(err => {
    // Only mark failures that happen during an automatic reconnect. Initial
    // connection failures must remain manually retryable regardless of this
    // setting.
    if (body?.autoReConnect && isAuthenticationFailure(err)) {
      window.store.autoReconnectAuthenticationFailures ??= new Map()
      window.store.autoReconnectAuthenticationFailures.set(body.tabId, {
        message: err.message || String(err)
      })
    }
    throw err
  })
}

export function runCmd (pid, cmd, options) {
  return fetch({
    pid,
    cmd,
    action: 'run-cmd'
  }, options)
}

export function execCmd (pid, cmd, timeoutMs, options) {
  return fetch({
    pid,
    cmd,
    timeoutMs,
    action: 'exec-cmd'
  }, options)
}

export function resizeTerm (pid, cols, rows) {
  return fetch({
    pid,
    cols,
    rows,
    action: 'resize-terminal'
  })
}

export function toggleTerminalLog (pid) {
  return fetch({
    pid,
    action: 'toggle-terminal-log'
  })
}

export function toggleTerminalLogTimestamp (pid) {
  return fetch({
    pid,
    action: 'toggle-terminal-log-timestamp'
  })
}

export function setTerminalLogPath (pid, logPath) {
  return fetch({
    pid,
    logPath,
    action: 'set-terminal-log-path'
  })
}

export function startTerminalLogFile (pid, logFilePath, addTimeStampToTermLog) {
  return fetch({
    pid,
    logFilePath,
    addTimeStampToTermLog,
    action: 'start-terminal-log-file'
  })
}
