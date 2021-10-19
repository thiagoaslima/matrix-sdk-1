import { ChatRoom } from "../../store/rooms"
import { ChatMessage } from '../../store/messages';
import { useSelector } from "react-redux";
import { selectCurrentChatRoom, selectCurrentChatRoomMessages } from "../../store";

const CurrentRoomUI = (props: { currentRoom: ChatRoom, messages: ChatMessage[] }) => {
  return (
    <div>
      <h2> { props.currentRoom.name } </h2>
      <ul>
        { props.messages.map(message => (
          <li key={message.eventId} dangerouslySetInnerHTML={{ 
            // @ts-ignore
            __html: message.message['formatted_body']  ?? message.message.body 
          }} />
        ))}
      </ul>
    </div>
  )
}

export const CurrentRoom = () => {
  const currentRoom = useSelector(selectCurrentChatRoom);
  const messages = useSelector(selectCurrentChatRoomMessages);

  if (!currentRoom) {
    return <h2>Select a room</h2>
  }

  return (
    <CurrentRoomUI currentRoom={currentRoom} messages={messages} />
  )
}