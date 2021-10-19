import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { getBrowserEnv } from '../lib/get-env';
import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '../app/store/hooks';
import { login } from '../features/chat/sagas/auth/login';

import styles from "../styles/Home.module.css";

const User = (props: { id: string, name: string }) => {
  const dispatch = useAppDispatch();

  const handleClick = useCallback(() => {
    dispatch(login({ userId: props.id }));
  }, [dispatch, props.id]);

  return (
    <p onClick={handleClick} id={props.id} className={styles.user}>
      {props.name}
    </p>
  )
}

const userList = [
  { id: getBrowserEnv().matrixUser1Id, name: "User 1" },
  { id: getBrowserEnv().matrixUser2Id, name: "User 2" }
];

const HomePage: NextPage = () => {
  
  const { push } = useRouter();

  useEffect(() => {
    push('/chat');
  }, [push]);

  return (
    <div className={styles.container}>
      <h1>Welcome! Select your user</h1>

      <ul className={styles.userList}>
        {userList.map(user => (
          <li key={user.id} className={styles.userListItem}>
            <User {...user} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HomePage;