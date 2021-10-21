import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/store-v2/hooks';
import { selectChatUserState } from "../../store";
import { actions } from '../../store/v2';

import styles from './topbar.module.css';

export const ChatTopbar = () => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.chat.user);
  const isLoggedOut = useAppSelector(state => !state.chat.status.logged);

  const handleClick = () => {
    if (user) {
      dispatch(actions.logout({ userId: user.id }))
    }
  }
  
  useEffect(() => {
    if (isLoggedOut) {
      push('/')
    }
  }, [isLoggedOut, push])

  return (
    <div className={styles.container}>
      <p>{ user?.displayName }</p>
      <button onClick={handleClick}>Logout</button>
    </div>
  )
}