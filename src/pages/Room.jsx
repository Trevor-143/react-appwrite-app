
import React, { useEffect, useState } from 'react';
import { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig/config';
import { ID } from 'appwrite';

function Room() {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState('')

  useEffect(() => {
    getMessages();
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
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGES);
      setMessages(response.documents);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
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
                <p> <small className='message-timestamp' >{message.$createdAt}</small></p>
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
