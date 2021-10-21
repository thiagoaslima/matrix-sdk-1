import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import Loader from "react-loader-spinner";

import { getBrowserEnv } from '../lib/get-env';
import { useAppDispatch, useAppSelector } from '../app/store-v2/hooks';
import { actions } from '../features/chat/store/v2/index';

import styles from "../styles/Home.module.css";

const userList = [
  { id: getBrowserEnv().matrixUser1Id, name: "User 1" },
  { id: getBrowserEnv().matrixUser2Id, name: "User 2" }
];

const User = (props: { id: string, name: string }) => {
  const dispatch = useAppDispatch();

  const handleClick = useCallback(() => {
    dispatch(actions.login({ userId: props.id }));
  }, [dispatch, props.id]);

  return (
    <p onClick={handleClick} id={props.id} className={styles.user}>
      {props.name}
    </p>
  )
}

const HomePage: NextPage = () => {
  const { push } = useRouter();
  const isReady = useAppSelector(state => state.chat.status.ready);
  const isLoading = useAppSelector(state => state.chat.status.loading);

  useEffect(() => {
    if (!isLoading && isReady) {
      push('/chat');
    }
  }, [isLoading, isReady, push]);

  return (
    <div className={styles.container}>

      { isLoading && (
        <>
          <h1>Syncing your user</h1>
          <Loader type="ThreeDots" />
        </>
      )}

      { !isLoading && (
        <>
        <h1>Welcome! Select your user</h1>
        <ul className={styles.userList}>
          {userList.map(user => (
            <li key={user.id} className={styles.userListItem}>
              <User {...user}/>
            </li>
          ))}
        </ul>
        </>
      )}
    </div>
  )
}

export default HomePage;