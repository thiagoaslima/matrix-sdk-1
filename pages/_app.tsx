import NextApp, { AppContext, AppInitialProps, AppProps } from 'next/app'
import { Provider as ReduxProvider } from 'react-redux'
import Cookies from 'cookies';

import { appStore } from '../app/store'
import { verifyToken } from '../lib/jwt';
import { isNextJSRouteChange } from '../lib/ssr';
import { useAppDispatch } from '../app/store/hooks';
import { LoginResponse } from './api/chat/login';
import { loginWithToken } from '../features/chat/sagas/auth/login-with-token';
import { adaptLoginResponse } from '../features/chat/sagas/auth/login';


import '../styles/globals.css'

const InitiateMatrixClient = (props: { loginResponse?: LoginResponse }) => {
  const dispatch = useAppDispatch();

  if (props.loginResponse) {
    const authData = adaptLoginResponse(props.loginResponse)
    
    dispatch(loginWithToken(authData));
  }

  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={appStore}>
      <InitiateMatrixClient {...pageProps} />
      <Component {...pageProps} />
    </ReduxProvider>
  )
}

MyApp.getInitialProps = async (appContext: AppContext): Promise<AppInitialProps & {authData?: LoginResponse}> => {
  const { req, res } = appContext.ctx;

  if (!req || !res) {
    return {
      pageProps: {},
    }
  }

  if (isNextJSRouteChange(appContext.ctx)) {
    return {
      pageProps: {},
    };
  }

  const cookies = new Cookies(req, res);
  const token = cookies.get('matrix-token');
  const loginResponse = token ? verifyToken<LoginResponse>(token) : undefined;
  const appProps = await NextApp.getInitialProps(appContext);

  if (req.url !== '/' && !loginResponse) {
    res.writeHead(307, { Location: '/' })
    res.end()
  }

  return {
    ...appProps,
    pageProps: { loginResponse }
  }
}

export default MyApp
