import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";

const host = "http://localhost:3000";

function App() {
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState('');
  const [id, setId] = useState();

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host)

    socketRef.current.on('getId', data => {
      setId(data)
    })

    socketRef.current.on('sendDataServer', dataGot => {
      setMess( oldMess => [...oldMess, dataGot.data])

    })

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if(message !== null)
    {
      const msg = {
        content: message,
        id: id
      }
      socketRef.current.emit('sendDataClient', msg)

      setMessage('')
    }
  }

  const renderMess = mess.map((m, index) =>
    <div key={index} className={`${m.id === id ? 'your-message' : 'other-people'} chat-item text-white`}>
        {m.content}
    </div>
  )

  const handleChange = (e) => {
    setMessage(e.target.value)
  }


  return (
      <div className="App">
        <div className="message">
            {renderMess}
        </div>
        <div className="boxchat">
          <input className="text--message" placeholder="Input your message" onChange={handleChange}></input>
          <button className="send" onClick={sendMessage}>Send</button>
        </div>
      </div>
  );
}

export default App;
