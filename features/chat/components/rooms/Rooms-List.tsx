import { useCallback, MouseEvent, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../../../app/store-v2/hooks';
import { Room } from '../../types/room';

import styles from './rooms-list.module.css'
import { actions } from '../../store/v2/index';

const RoomsListItem = ({ room }: { room: Room }) => {
  return (
    <li className={styles.listItem} id={room.id}>{room.name || room.canonicalAlias || room.id }</li>
  )
}

const RoomsListUI = (props: { open?: boolean; rooms: Room[], summary: string, onClick: (event: MouseEvent) => void }) => {
  const open = props.open ? { open: true } : {}
  return (
    <details {...open}>
      <summary>{ props.summary }</summary>
      <ul className={styles.list} onClick={props.onClick}>
        {
          props.rooms.map(room => (
            <RoomsListItem key={room.id} room={room} />
          ))
        }
      </ul>
    </details>
  )
}

export const RoomsList = () => {
  const dispatch = useAppDispatch();
  const chatRooms = useAppSelector(state => {
    return Array.from(state.chat.rooms.available).map(id => state.chat.rooms.entities[id]).sort((a, b) => a.name.localeCompare(b.name))
  });
  const joinedRooms = useAppSelector(state => {
    return Array.from(state.chat.rooms.joined).map(id => state.chat.rooms.entities[id]).sort((a, b) => a.name.localeCompare(b.name))
  });

  const handleClick = useCallback((event: MouseEvent) => {
    const element = event.target;

    if (!element) {
      return;
    }

    const targetId = (element as HTMLElement).id;

    if (targetId) {
      dispatch(actions.selectRoom({ roomId: targetId }));
    }
  }, [dispatch]);

  return (
    <>
    <RoomsListUI open rooms={joinedRooms} onClick={handleClick} summary="Joined rooms" />
    <RoomsListUI rooms={chatRooms} onClick={handleClick} summary="Other rooms" />
    </>
  )
}

