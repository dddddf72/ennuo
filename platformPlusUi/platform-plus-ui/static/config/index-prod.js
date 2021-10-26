/**
 * 生产环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // window.SITE_CONFIG['baseUrl'] = 'http://50.105.118.18:8888/platform-plus' // 后台接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://106.12.82.39:8888/platform-plus'
  window.SITE_CONFIG['baseUrl'] = 'http://47.104.17.139:8888/platform-plus'
  // cdn地址 = 域名 + 版本号
  // window.SITE_CONFIG['domain'] = 'https://platform-wxmall.oss-cn-beijing.aliyuncs.com/boot/' // 域名
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
