import gql from 'graphql-tag';
import client from './client';

const messagesQuery = gql`
  query MessagesQuery {
    messages {
      id
      from
      text
    }
  }
`;

const addMessageMutation = gql`
  mutation AddMessageMutation($input: MessageInput!) {
    message: addMessage(input: $input) {
      id
      from
      text
    }
  }
`;

const addedMessageSubscription = gql`
subscription{
  messagesAdded{
    id
    from
    text
  }
}
`

export async function addMessage(text) {
  const {data} = await client.mutate({
    mutation: addMessageMutation,
    variables: {input: {text}}
  });
  return data.message;
}

export function addedMessage(hadleMessage) {
  const observable =  client.subscribe({query: addedMessageSubscription});
  return observable.subscribe(({ data }) => { hadleMessage(data.messagesAdded) })
}

export async function getMessages() {
  const {data} = await client.query({query: messagesQuery});
  return data.messages;
}

