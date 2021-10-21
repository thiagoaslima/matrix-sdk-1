import { MessageTypeEnum, TextMessage } from "../../types/message";
import { RoomEvent } from "../../types/room";
import { TextMessageUI } from './Text-message';

const isTextMessage = (event: RoomEvent): event is RoomEvent<TextMessage> => {
  return event.content.msgtype === MessageTypeEnum.text;
}

export const MessageUI = ({ message }: { message: RoomEvent }) => {
  if (message.type !== "m.room.message") {
    return null;
  }

  if (isTextMessage(message)) {
    return <TextMessageUI message={message} />
  }

  return <p>{message.content.msgType}: { message.id}</p>
}