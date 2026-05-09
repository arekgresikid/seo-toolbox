import { onRequestGet as __api_pagespeed_ts_onRequestGet } from "E:\\seo-toolbox\\functions\\api\\pagespeed.ts"
import { onRequestGet as __api_proxy_ts_onRequestGet } from "E:\\seo-toolbox\\functions\\api\\proxy.ts"

export const routes = [
    {
      routePath: "/api/pagespeed",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_pagespeed_ts_onRequestGet],
    },
  {
      routePath: "/api/proxy",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_proxy_ts_onRequestGet],
    },
  ]