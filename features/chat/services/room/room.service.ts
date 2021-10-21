import { getEnv } from "../../../../lib/get-env";
import { chatClient } from "../client-sdk/client";

const getSearchParams = (args: { limit: number, direction: string, from?: string, to?: string }): URLSearchParams => {
  const { limit, direction, from, to } = args;
  const searchParams = new URLSearchParams("");
  
  searchParams.set('limit', String(limit));
  searchParams.set('direction', direction);
  from && searchParams.set('from', from);
  to && searchParams.set('to', to);

  return searchParams;
}

export const getMessages = async ({
  roomId,
  limit = 20,
  direction,
  from,
  to,
}: {
  roomId: string;
  limit: number;
  direction: 'b' | 'f',
  from?: string;
  to?: string;
}) => {
  const searchParams = getSearchParams({ limit, direction, from, to });
  const url = `${getEnv().matrixServerUrl}/_matrix/client/r0/rooms/${roomId}/messages?${searchParams.toString()}`;

  const messagesResponse = await fetch(url, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${chatClient.getAccessToken()}`
    }
  });

  const messages = await messagesResponse.json();

  console.log(messages);
}

