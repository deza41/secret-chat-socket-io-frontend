import {useEffect ,useState} from 'react'
import {Widget, addResponseMessage} from 'react-chat-widget';
import "react-chat-widget/lib/styles.css";
import {io} from 'socket.io-client'
import logo from "../logo.svg"
import {uniqueNamesGenerator,colors,animals } from "unique-names-generator"
import MainChatbox from "../Components/Chatbox"

const socket = io('http://localhost:8000');

const Home = () => {

    const [messages, setMessages] = useState('')
    const [chat, setchat] = useState([])  
    const [randomName, randomNameSet] = useState('')

 

    useEffect(()=>{

        randomNameSet(uniqueNamesGenerator({
            dictionaries: [colors, animals],
            // style: "upperCase",
            
        }))

        //grab msg from backend
        socket.on('receive-message', (message)=>{
            addResponseMessage(message);
            // messageListAdd(message,"external");
            const id = Math.floor(Math.random() * 10000) + 1;
            const newMsg = {id: id, text:message, user: "external"}
            if(chat.length === 0)
            {
                setchat([newMsg]);
            }
            setchat([...chat,newMsg]);
        });
    },[chat]);



    const handleNewUserMessage = (newMessage) => {
        //send msg to backend
        socket.emit("send-message", randomName+ ": " + newMessage);
        const id = Math.floor(Math.random() * 10000) + 1;
            const newMsg = {id: id, text:newMessage, user: "me"}
            if(chat.length === 0)
            {
                setchat([newMsg]);
            }
            setchat([...chat,newMsg]);

    };




    return( <div className="container">
        <div className="row">
            <h1 className="text-center p-5 display-1">Secret Chat</h1>
            <hr></hr>
        </div>
        <div className="row">
            <MainChatbox setMessages={setMessages} setchat={setchat} chat={chat} messages={messages} randomName={randomName} socket={socket}/>  
        </div>
        <Widget 
            title="Secret Chat"
            subtitle={"Joined as: " + randomName}
            handleNewUserMessage={handleNewUserMessage}
            profileAvatar={logo}
        />
    </div>
    );
}

export default Home;