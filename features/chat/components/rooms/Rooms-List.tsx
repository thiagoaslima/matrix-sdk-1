import { useCallback, MouseEvent, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../../../app/store/hooks';
import { selectChatRooms, selectChatRoomsState } from '../../store/index';
import { ChatRoom, setCurrentRoom } from '../../store/rooms';

import styles from './rooms-list.module.css'
import { matrixClient } from '../../services/client';

const RoomsListItem = ({ room }: { room: ChatRoom }) => {
  return (
    <li className={styles.listItem} id={room.roomId}>{room.name || room.canonicalAlias || room.roomId }</li>
  )
}

const RoomsListUI = (props: { rooms: ChatRoom[], onClick: (event: MouseEvent) => void }) => {
  return (
    <details open>
      <summary>Public Rooms</summary>
      <ul className={styles.list} onClick={props.onClick}>
        {
          props.rooms.map(room => (
            <RoomsListItem key={room.roomId} room={room} />
          ))
        }
      </ul>
    </details>
  )
}

export const RoomsList = () => {
  const dispatch = useAppDispatch();
  const chatRooms = useAppSelector(selectChatRooms.selectAll);
  const chatState = useAppSelector(selectChatRoomsState);
  const currentRoom = chatState.currentRoom;

  const handleClick = useCallback((event: MouseEvent) => {
    const element = event.target;

    if (!element) {
      return;
    }

    const targetId = (element as HTMLElement).id;

    if (targetId) {
      dispatch(setCurrentRoom({ roomId: targetId }));
    }
  }, [dispatch]);

  return (
    <RoomsListUI rooms={chatRooms} onClick={handleClick} />
  )
}

