const apiPath = '/api/v1';

export const apiRoutes = {
  loginPath: () => [apiPath, 'login'].join('/'),
  signupPath: () => [apiPath, 'signup'].join('/'),
  dataPath: () => [apiPath, 'data'].join('/'),
};

export const appPaths = {
  loginPagePath: '/login',
  notFoundPagePath: '*',
  chatPagePath: '/',
  signUpPagePath: '/signup',
};
