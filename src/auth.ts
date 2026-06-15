import {
  init,
  AuthType,
  AuthStatus,
  AuthFailureType,
} from "@thoughtspot/visual-embed-sdk";
import {
  ServerConfiguration,
  ThoughtSpotRestApi,
  createBearerAuthenticationConfig,
  createConfiguration,
} from "@thoughtspot/rest-api-sdk";
const TS_HOST = "https://172.32.81.154:8443/";
// const TS_HOST = `https://${HOST}:8443`;
// const TS_HOST = `https://nebula-homepagev4.thoughtspotdev.cloud/`;
// const TS_HOST = `http://localhost:3000`;
const getToken = (username: string, password: string) => {
  console.log("getToken function");
  return fetch(`http://localhost:3000/api/rest/2.0/auth/token/full`, {
    headers: {
      "content-type": "application/json",
    },
    body: `{"username":"${username}","validity_time_in_sec":300,"org_id":0,"auto_create":false,"password":"${password}"}`,
    method: "POST",
  })
    .then((response) => {
      console.log("get token raw response", response);
      return response.json();
    })
    .then((data) => {
      console.log("Token is generated ", data.token);
      return data.token;
    });
};
export const trustedAuth = (
  username = "tsadmin",
  password = "4Xyc1f%[H^3L",
) => {
  console.log("auth init called ");
  return init({
    // thoughtSpotHost: `https://${HOST}:8443`,
    // thoughtSpotHost: `http://localhost:3000/`,
    thoughtSpotHost: TS_HOST,
    authType: AuthType.TrustedAuthToken,
    username: "tsadmin",
    getAuthToken: () => {
      console.log("get token is called");
      return getToken(username, password);
    },
  });
};
export const trustedAuthCookieless = (
  username = "tsadmin",
  password = "4Xyc1f%[H^3L",
) => {
  console.log("auth init called ");
  return init({
    // thoughtSpotHost: `http://localhost:3000/`,
    thoughtSpotHost: TS_HOST,
    authType: AuthType.TrustedAuthTokenCookieless,
    getAuthToken: () => {
      console.timeLog("cookiless called");
      return getToken(username, password);
    },
  });
};
export const initCookieless = () => {
  console.log("Cookie less initiated");
  const authStatus = init({
    thoughtSpotHost: TS_HOST,
    authType: AuthType.TrustedAuthTokenCookieless,
    getAuthToken: async () => {
      console.log("here");
      const config = createBearerAuthenticationConfig(TS_HOST, {
        username: "tsadmin",
        password: "4Xyc1f%[H^3L",
      });
      const tsRestApiClient = new ThoughtSpotRestApi(config);
      const data = await tsRestApiClient.getFullAccessToken({
        username: "tsadmin",
        password: "4Xyc1f%[H^3L",
      });
      console.log("data is ", data);
      return data.token;
    },
  });
  authStatus?.on(AuthStatus.SUCCESS, () => {
    console.log("Cookieles chal gaya");
  });
};
export const trustedAuthTokenCookielessInit = (
  tsHost = TS_HOST,
  username = "tsadmin",
  password = "4Xyc1f%[H^3L",
) => {
  console.log("trustedAuthTokenCookielessInit called", tsHost);
  registerAuthEvent(
    init({
      thoughtSpotHost: tsHost,
      authType: AuthType.TrustedAuthTokenCookieless,
      getAuthToken: async () => {
        const config = createConfiguration({
          baseServer: new ServerConfiguration(tsHost, {}),
        });
        const tsRestApiClient = new ThoughtSpotRestApi(config);
        const data = await tsRestApiClient.getFullAccessToken({
          username,
          password,
        });
        return data.token;
      },
      autoLogin: true,
    }),
    AuthType.TrustedAuthTokenCookieless,
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registerAuthEvent = (aEE: any, name: string) => {
  aEE.on(AuthStatus.SUCCESS, () => {
    console.log("Success", name);
  });
  aEE.on(AuthStatus.FAILURE, (e: AuthFailureType) => {
    console.log("Auth fail", e);
  });
};

export const authNone = () => {
  console.log("embed auth  called");
  return init({
    // thoughtSpotHost: `https://${HOST}:8443`,
    //   thoughtSpotHost: `https://10.87.91.66`,
    thoughtSpotHost: TS_HOST,
    authType: AuthType.None,
    customizations: {
      // style: {
      // //   customCSSUrl:
      // //     "https://cdn.jsdelivr.net/gh/thoughtspot/custom-css-demo/css-variables.css",
      //   customCSS: {
      //     rules_UNSTABLE: {
      //       ".marker-container-v2": {
      //         display: "none !important",
      //       },
      //     },
      //   },
      // },
    },
  });
};

export const preTokenInitCookieless = () => {
  console.log("Cookie less initiated");
  init({
    thoughtSpotHost: TS_HOST,
    authType: AuthType.TrustedAuthTokenCookieless,
    autoLogin: true,
    disableLoginRedirect: true,
    getAuthToken: async () => {
      return "dHNhZG1pbjpKSE5vYVhKdk1TUlRTRUV0TWpVMkpEVXdNREF3TUNSRU5rRkNiVlpRVUhsNU5VSlJlVE5OT1hGdVRsVm5QVDBrWjB4M2FIWnFhMHBxTUZjeE5uSnBOM0ZZUjNOc2RVTktXSGxHYzBGS2FHNHpTMWhHWXpSbFRVMHdhejA=";
    },
  });
  // authStatus.on(AuthStatus.SUCCESS, () => {
  //   console.log('Cookieles chal gaya');
  // });
};
