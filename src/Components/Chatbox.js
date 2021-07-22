import {addUserMessage} from 'react-chat-widget';
import {useState, useEffect} from 'react'
import Message from "./Message"


const Chatbox = ({setMessages, chat, setchat, messages, randomName, socket}) => {


    const [newMsgItem, setNewMsgItem] = useState('')
    
    // const newMessage = (newMsgItem) => {
    //     return newMsgItem
    // }


    const onSubmit = (e) =>{
        e.preventDefault()
        if(!newMsgItem){
            alert("Must enter something")
            return
        }
        socket.emit("send-message", randomName+ ": " + newMsgItem);
        const id = Math.floor(Math.random() * 10000) + 1;
        const newMsg = {id: id, text:newMsgItem, user: "me"}
        if(chat.length === 0)
            {
                setchat([newMsg]);
            }
            setchat([...chat,newMsg]);
        addUserMessage(newMsgItem);
        setNewMsgItem('')

    }


    useEffect(()=>{

        socket.on('receive-message', (message)=>{
            const id = Math.floor(Math.random() * 10000) + 1;
        const newMsg = {id: id, text:message, user: "external"}
        if(chat.length === 0)
            {
                setchat([newMsg]);
            }
            setchat([...chat,newMsg]);
        addUserMessage(newMsgItem);
        setNewMsgItem('')

        });

    });




    // console.log(messages)


    return(
        <form className='search-form' onSubmit={onSubmit}>
                <div id="chatbox" className="chatbox">
                {chat.map((message) => (
                <Message key={message.id} message={message}/>    
                ))} 

                </div>
                <div id='searchContainer'>
                    <input type='text' placeholder='Search' className="msg" value={newMsgItem} onChange={(e)=> setNewMsgItem(e.target.value)}/>
                    <input type='submit' value='Submit' className="bn5"/>
                </div>
        </form>
    ) 
}

export default Chatbox;
