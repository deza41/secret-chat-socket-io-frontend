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

const socket = io('https://ancient-retreat-05963.herokuapp.com/');
// const socket = io('http://localhost:8000/');


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

        socket.emit('last-chat', "getting chat");

        // const sweet = {"command":"SELECT","rowCount":5,"oid":null,"rows":[{"msg_id":11,"msg_log":"cat_man: yoyooyoyoy"},{"msg_id":12,"msg_log":"cat_man: yoyooyoyoy"},{"msg_id":13,"msg_log":"cat_man: dsdsdssd"},{"msg_id":14,"msg_log":"cat_man: dsdsdssd"},{"msg_id":15,"msg_log":"cat_man: sdsdsdsdsdsdsdd"}],"fields":[{"name":"msg_id","tableID":2886789,"columnID":1,"dataTypeID":23,"dataTypeSize":4,"dataTypeModifier":-1,"format":"text"},{"name":"msg_log","tableID":2886789,"columnID":2,"dataTypeID":1043,"dataTypeSize":-1,"dataTypeModifier":229,"format":"text"}],"_parsers":[null,null],"_types":{"_types":{"arrayParser":{},"builtins":{"BOOL":16,"BYTEA":17,"CHAR":18,"INT8":20,"INT2":21,"INT4":23,"REGPROC":24,"TEXT":25,"OID":26,"TID":27,"XID":28,"CID":29,"JSON":114,"XML":142,"PG_NODE_TREE":194,"SMGR":210,"PATH":602,"POLYGON":604,"CIDR":650,"FLOAT4":700,"FLOAT8":701,"ABSTIME":702,"RELTIME":703,"TINTERVAL":704,"CIRCLE":718,"MACADDR8":774,"MONEY":790,"MACADDR":829,"INET":869,"ACLITEM":1033,"BPCHAR":1042,"VARCHAR":1043,"DATE":1082,"TIME":1083,"TIMESTAMP":1114,"TIMESTAMPTZ":1184,"INTERVAL":1186,"TIMETZ":1266,"BIT":1560,"VARBIT":1562,"NUMERIC":1700,"REFCURSOR":1790,"REGPROCEDURE":2202,"REGOPER":2203,"REGOPERATOR":2204,"REGCLASS":2205,"REGTYPE":2206,"UUID":2950,"TXID_SNAPSHOT":2970,"PG_LSN":3220,"PG_NDISTINCT":3361,"PG_DEPENDENCIES":3402,"TSVECTOR":3614,"TSQUERY":3615,"GTSVECTOR":3642,"REGCONFIG":3734,"REGDICTIONARY":3769,"JSONB":3802,"REGNAMESPACE":4089,"REGROLE":4096}},"text":{},"binary":{}},"RowCtor":null,"rowAsArray":false}
        // sweet.rows.map((message) => {
        //     addResponseMessage(message.msg_log)
        //     setRec({text:message.msg_log, user: "external"})

        //     var objDiv = document.getElementById("bottom");
        //     objDiv.scrollTop = objDiv.scrollHeight;


        // })

    

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

    useEffect(()=>{
        socket.on('get-chat', (chat)=>{

            chat.rows.map((message) => {
                addResponseMessage(message.msg_log);
                setRec({text:message.msg_log, user: "external"})
                var objDiv = document.getElementById("bottom");
                objDiv.scrollTop = objDiv.scrollHeight;
    
                return '';
            })

            // console.log(chat)
            // console.log('test')
        });
    },[]);




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