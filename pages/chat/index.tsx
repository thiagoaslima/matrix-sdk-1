import { NextPage } from 'next';

import styles from '../../styles/chat.module.css'
import { ChatTopbar } from '../../features/chat/components/topbar/topbar';
import { RoomsList } from '../../features/chat/components/rooms/Rooms-List';
import { CurrentRoom } from '../../features/chat/components/current-room/Current-Room';

const ChatPage: NextPage = () => {
  return (
    <div className={styles.chatContainer}>
    <div className={styles.chatTopbar}>
      <ChatTopbar />
    </div>
    <div className={styles.chatMain}>
      <div className={styles.chatSidebar}>
        <RoomsList />
      </div>
      <div className={styles.chatText}>
        <CurrentRoom />
      </div>
    </div>
    <div className={styles.chatFooter}>
      Footer
    </div>
    </div>
  )
}

export default ChatPage;