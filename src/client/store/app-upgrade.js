/**
 * app upgrade
 */

export default Store => {
  // Version update detection is intentionally disabled in this build. Keep the
  // method as a no-op so legacy UI entry points cannot trigger release checks
  // or outbound version-query requests.
  Store.prototype.onCheckUpdate = () => {}

  Store.prototype.getProxySetting = function () {
    const {
      proxy,
      enableGlobalProxy
    } = window.store.config
    if (!enableGlobalProxy) {
      return ''
    }
    return typeof proxy !== 'string' ? '' : proxy
  }
}
