const About = () => {

    return(
        <div className="container-fluid h-100">
            <div className="row justify-content-center h-100">
                <h1 className="text-center p-2 display-1">About</h1>
                <hr></hr> 
                <div className="">
                    <div className="card-body msg_card_body" id='bottom'>
                        <p className="text-center p-4">Secret chat app which uses socket.io to relay messages in real time to the backend server.</p>
                        <p className="text-center">Backend technologies:</p>
                        <ul className="Aboutcard">
                            <li className="">Node.js</li>
                            <li className="">Express.js</li>
                            <li className="">Socket.io</li>  
                        </ul>
                        <br></br>
                        <br></br>
                        <p className="text-center p-2">Frontend technologies:</p>
                        <ul className="Aboutcard2">
                            <li className="">React.js</li>
                            <li className="">Socket.io</li>  
                        </ul>
                    </div >
                </div>
            </div>
        </div>
    
    )
        

}

export default About;