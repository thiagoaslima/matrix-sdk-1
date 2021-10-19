import { useRouter } from 'next/router';
import { useAppSelector, useAppDispatch } from '../../../../app/store/hooks';
import { logout } from '../../sagas/auth/logout';
import { selectChatUserState } from "../../store";

import styles from './topbar.module.css';

export const ChatTopbar = () => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectChatUserState);

  const handleClick = () => {
    dispatch(logout({ userId: user.id }))
    push('/')
  }

  return (
    <div className={styles.container}>
      <p>{ user.displayName }</p>
      <button onClick={handleClick}>Logout</button>
    </div>
  )
}