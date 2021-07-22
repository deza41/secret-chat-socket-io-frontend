import {useEffect ,useState} from 'react'
import {Widget,addResponseMessage,addUserMessage} from 'react-chat-widget';
import "react-chat-widget/lib/styles.css";
import {io} from 'socket.io-client'
import logo from "../business-man.svg"
import logo2 from "../vintage-man.svg"
import {uniqueNamesGenerator,colors,animals } from "unique-names-generator"
// import MainChatbox from "../Components/Chatbox"
import '../home.css'
import ReactScrollableFeed from 'react-scrollable-feed';

const socket = io('https://socket-io-chat-secret.herokuapp.com:50948');

const Home = () => {

    const [messages, setMessages] = useState('')
    const [rec, setRec] = useState({})
    const [chat, setchat] = useState([])  
    const [randomName, randomNameSet] = useState('')
    const [numUsers, numUsersSet] = useState('0')

 

    useEffect(()=>{

        randomNameSet(uniqueNamesGenerator({
            dictionaries: [colors, animals],
            // style: "upperCase",
            
        }))

        socket.on('current-Users', (users)=>{
            // console.log(users)
            numUsersSet(users);
        });

        // socket.emit('get-users-init', );

        //grab msg from backend
        socket.on('receive-message', (message)=>{
            addResponseMessage(message);
            //rec must be to store the message as the [] < dependancy requires the dependancy to not change size e.g. ...chat
            //this is then passed into another use affect with the dependancy[rec] to ensure that it will only run when rec changes thus allowing us to change chat without callback stacks

            setRec({text:message, user: "external"})
            setchat([message]);

            var objDiv = document.getElementById("bottom");
            objDiv.scrollTop = objDiv.scrollHeight;


        });
    },[]);


    useEffect(()=>{
        setchat([...chat,rec]);
        // eslint-disable-next-line 
    },[rec]);




    const handleNewUserMessage = (newMessage) => {
        //send msg to backend
        socket.emit("send-message", randomName+ ": " + newMessage);
        setRec({text:newMessage, user: "me"})

        var objDiv = document.getElementById("bottom");
        objDiv.scrollTop = objDiv.scrollHeight;

    };


    const onSubmit = (e) =>{
        e.preventDefault()
        socket.emit("send-message", randomName+": "+messages);
        setRec({text:messages, user: "me"})
        addUserMessage(messages)
        setMessages('')

        // var elmnt = document.getElementById("bottom");
        // elmnt.scrollIntoView(true);

        var objDiv = document.getElementById("bottom");
        objDiv.scrollTop = objDiv.scrollHeight;

    }




    return( 
    <div className="container-fluid h-100">
        <div className="row justify-content-center h-100">
            <h1 className="text-center p-2 display-1">Secret Chat</h1>
            <hr></hr>
            <p className="text-center p-1">Joined as: {randomName}</p>
            <p>Connected users: {numUsers}</p>
        </div>
        <div className="card">
            <div className="card-body msg_card_body" id='bottom'>

                    <ReactScrollableFeed>
                        {chat.map((message, index) => (
                        <div className={message.user ==="me" ? 'd-flex justify-content-end mb-4' : 'd-flex justify-content-start mb-4'} key={index}>
                            {/* <div class="img_cont_msg"> */}
                            <div className={message.user ==="me" ? 'img_cont_msg' : 'img_cont_msg'}>
                                <img src={message.user ==="me" ? logo2 : logo} className="rounded-circle user_img_msg" alt="profilePic" key={index}></img>
                            </div>
                            <div className={message.user ==="me" ? 'msg_cotainer_send' : 'msg_cotainer'} key={index}>
                                {message.text}
                            </div>   
                        </div>
                        ))} 
                    </ReactScrollableFeed>
                    
            </div >
            <form className='form-control search' onSubmit={onSubmit}>
                    <div id='searchContainer' className="card-footer">
                        <div className="input-group">
                            <input type='text' placeholder='Enter Text...' className="form-control type_msg" value={messages} onChange={(e)=> setMessages(e.target.value)} required
                            
                            />
                            <input type='submit' value='Send' className="input-group-text search_btn"/>
                        </div>
                        
                    </div>
            </form>
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