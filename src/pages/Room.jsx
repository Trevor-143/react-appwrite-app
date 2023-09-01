
import React, { useEffect, useState } from 'react';
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig/config';
import { ID, Query } from 'appwrite';
import { Trash2 } from 'react-feather';

function Room() {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState('')

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response => {
      if(response.events.includes('databases.*.collections.*.documents.*.create')) {
        console.log('message was created')
        setMessages(prevState => [response.payload, ...prevState])
      }
      if(response.events.includes('databases.*.collections.*.documents.*.delete')) {
        console.log('message was deleted')
        setMessages(prevState => messages.filter(message => message.$id != response.payload.$id ))
      }
    });

    return () => {
      unsubscribe()
    }

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    let payload = {
      body:messageBody
    }
    let res = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload
    )
    setMessageBody('')
  }
  
  const getMessages = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID, 
        COLLECTION_ID_MESSAGES,
        [ Query.orderDesc('$createdAt'), Query.limit(20) ]
      );
      setMessages(response.documents);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  const deleteDocument = async (message_id) => {
    databases.deleteDocument(
      DATABASE_ID, 
      COLLECTION_ID_MESSAGES, 
      message_id 
    );
  }

  return (
    <main className='container' >
      <div className='room--container' >

        <form onSubmit={handleSubmit} id="message--form" >
          <div>
            <textarea
              required
              maxLength="1000"
              placeholder='Say something...'
              onChange={(e) => {setMessageBody(e.target.value)}}
              value={messageBody}
            >
            </textarea>
          </div>
          <div className='send-btn--wrapper' >
            <input className='btn btn--secondary' type="submit" value="send" />
          </div>
        </form>

        <div>
          {messages.map(message => (
            <div key={message.$id} className='message--wrapper' >
              <div className='message--header' >
                <small className='message-timestamp' > { new Date(message.$createdAt).toLocaleString()}</small>
                <Trash2 className='delete--btn' onClick={() => {deleteDocument(message.$id)}} />
              </div>
              <div className='message--body' >
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </main>
  );
}

export default Room;
