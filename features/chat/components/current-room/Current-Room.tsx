import { useState, useCallback } from 'react';
import Loader from 'react-loader-spinner';

import { actions } from '../../store/v2/index';
import { useAppSelector, useAppDispatch } from '../../../../app/store-v2/hooks';
import { Room, RoomEvent } from '../../types/room';
import { MessageUI } from "../messages/Message";

import styles from '../messages/message.module.css';

const CurrentRoomUI = (props: { currentRoom: Room, events: RoomEvent[] }) => {
  return (
    <>
      <h2> {props.currentRoom.name} </h2>
      <ul className={styles.container}>
        {props.events.map(event => (
          <MessageUI key={event.id} message={event} />
        ))}
      </ul>
    </>
  )
}

const MessageInputUI = (props: { currentRoom: Room }) => {
  const dispatch = useAppDispatch()
  const [text, setText] = useState('');

  const handleClick = useCallback(() => {
    if (text) {
      dispatch(actions.sendMessage({
        roomId: props.currentRoom.id,
        text
      }))
    }
  }, [dispatch, props.currentRoom.id, text])
  
  return (
    <div style={{display: 'flex', flexFlow: 'row nowrap', padding: '5px 5px 10px', fontSize: '20px'}}>
      <input style={{flex: 1, backgroundColor: 'white', padding: '10px', marginRight: '10px'}} type="text" value={text} onChange={(evt) => setText(evt.target.value)} />
      <button style={{cursor: 'pointer'}} type="button" onClick={handleClick}>Send</button>
    </div>
  )
}

export const CurrentRoom = () => {
  const currentRoom = useAppSelector(state => {
    const roomsState = state.chat.rooms;

    if (roomsState.current === null) {
      return null;
    }

    return roomsState.entities[roomsState.current] ?? null
  });

  const isSyncing = useAppSelector(state => {
    const roomsState = state.chat.rooms;

    if (roomsState.current === null) {
      return false;
    }

    return state.chat.events.perRoom[roomsState.current].isSyncing;
  });

  const roomEvents = useAppSelector(state => {
    const roomsState = state.chat.rooms;
    const eventsState = state.chat.events;

    if (roomsState.current === null) {
      return [];
    }

    return Array.from(eventsState.perRoom[roomsState.current]?.list ?? []).map(id => eventsState.entities[id]);
  });

  if (!currentRoom) {
    return <h2>Select a room</h2>
  }

  if (isSyncing) {
    return <Loader type="ThreeDots" />;
  }

  return (
    <>
      <CurrentRoomUI currentRoom={currentRoom} events={roomEvents} />
      <MessageInputUI currentRoom={currentRoom} />
    </>
  )
}