import { TextMessage } from '../../types/message';
import { RoomEvent } from "../../types/room";

import styles from "./message.module.css"
import { useAppSelector } from '../../../../app/store-v2/hooks';
import classnames from 'classnames';

export const TextMessageUI = ({ message }: { message: RoomEvent<TextMessage> }) => {
  const user = useAppSelector(state => state.chat.user);
  const content = message.content as TextMessage;

  debugger;
  
  return (
    <div className={classnames(styles.chatMessage, {
      [styles.ownMessage]: user?.id === message.sender
    })} key={message.id}>
      <p className={styles.sender}>{ message.sender }</p>
      <p dangerouslySetInnerHTML={{
        // @ts-ignore
        /** @TODO Use DOMPurify */
        __html: content['formatted_body'] ?? content.body
      }} />
    </div>
  )
}