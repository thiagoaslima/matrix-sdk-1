import NextApp, { AppContext, AppInitialProps, AppProps } from 'next/app'
import { Provider as ReduxProvider } from 'react-redux'
import Cookies from 'cookies';
import {enableMapSet} from "immer"

import { appStore } from '../app/store-v2'
import { verifyToken } from '../lib/jwt';
import { isNextJSRouteChange } from '../lib/ssr';
import { useAppDispatch } from '../app/store/hooks';
import { LoginResponse } from './api/chat/login';
import { LoginRawResponse } from '../features/chat/services/auth/auth.service';

import '../styles/globals.css'
import { actions } from '../features/chat/store/v2';
import { useAppSelector } from '../app/store-v2/hooks';


enableMapSet();

const InitiateMatrixClient = (props: { loginResponse?: LoginRawResponse }) => {
  const isLoggedIn = useAppSelector(state => state.chat.status.logged);
  const dispatch = useAppDispatch();

  if (props.loginResponse && !isLoggedIn) {
    dispatch(actions.login({ userId: props.loginResponse.user_id }));
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

MyApp.getInitialProps = async (appContext: AppContext): Promise<AppInitialProps & { authData?: LoginResponse }> => {
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
  let loginResponse;

  try {
    loginResponse = token && verifyToken<LoginResponse>(token);
  } catch {
    loginResponse = undefined;
  }

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
