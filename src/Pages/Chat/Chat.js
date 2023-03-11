import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Chat(props) {
    const { socket } = props

    const { username, room } = useSelector(state => state.ChatReducer)
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [needHelp, setNeedHelp] = useState(false)
    const [suggestion, setSuggestion] = useState("");

    const navigate = useNavigate()

    const getContext = () => {
        let menteePreviousMessageList = []
        let menteePreviousMessage = ""

        for (let i = messageList.length - 1; i >= 0; i--) {
            if (messageList[i].author !== "Mentee") {
                break;
            }
            menteePreviousMessageList.push(messageList[i]);
        }

        for (let i = menteePreviousMessageList.length - 1; i >= 0; i--) {
            menteePreviousMessage += (menteePreviousMessageList[i].message + ". ");
        }

        const context = {
            menteePreviousMessage,
            currentMessage
        }
        return context
    }

    const getSuggestion = async () => {
        await axios({
            url: "http://www.randomnumberapi.com/api/v1.0/randomnumber",
            method: "GET",
            // data: context
        })
            .then(async (response) => {
                console.log(response.data[0])
                setSuggestion(response.data[0])
            })
    }

    const checkAndSendMessage = async () => {
        if (currentMessage !== "") {
            if (username === "Mentor") {
                const context = getContext()
                console.log(context)
                await axios({
                    url: "http://www.randomnumberapi.com/api/v1.0/randomnumber",
                    method: "GET",
                    // data: context
                })
                    .then(async (response) => {
                        console.log(response.data[0])
                        if (response.data[0] > 50) {
                            alert("Your message may be harmful to the mentee")
                            setNeedHelp(true)
                            return
                        } else {
                            sendMessage()
                        }
                    })
            } else {
                sendMessage()
            }
        }
    };

    const sendMessage = async () => {
        const messageData = {
            room: room,
            author: username,
            message: currentMessage,
            time:
                new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
        };

        await socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        setCurrentMessage("");
    }

    const renderMessage = () => {
        return messageList.map((messageContent, index) => {
            return (
                <div style={{ border: `2px solid ${messageContent.author === username ? "#ccc" : "#dedede"}`, backgroundColor: `${messageContent.author === username ? "#ddd" : "#f1f1f1"}`, borderRadius: "5px", padding: "5px", }} key={index}>
                    <div style={{ textAlign: `${messageContent.author === username ? "right" : "left"}` }}>
                        <p style={{ fontWeight: "bold", fontSize: "20px" }}>{messageContent.author}</p>
                        <p>{messageContent.message}</p>
                        <p style={{ fontSize: "12px", color: "gray" }}>{messageContent.time}</p>
                    </div>
                </div>
            );
        })
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", overflowX: "hidden", overflowY: "auto" }}>
            <div>
                <div style={{ height: "100px", background: "#263238", display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0" }}>
                    <p style={{ fontSize: "32px", color: "white", marginLeft: "10px", fontWeight: "bold" }}>Se<span style={{ color: "#205bec" }}>same</span>  Live chat</p>
                    <div style={{ marginRight: "10px" }}>
                        <button onClick={() => {
                            navigate('/', { replace: true })
                        }} style={{ cursor: "pointer", padding: "10px 20px", borderRadius: "10px", backgroundColor: "white", borderColor: "transparent", fontSize: "20px" }}>Back to home</button>
                    </div>
                </div>
                <div style={{ width: "100%", height: "100%" }}>
                    {renderMessage()}
                </div>
            </div>
            <div>
                <div onClick={ async () => {
                    await getSuggestion()
                    setNeedHelp(false)
                }} style={{width: "100%"}}>
                    <button style={{display: `${needHelp ? "inline": "none"}`, margin: "10px 0px 10px 30px", padding: "10px 20px", borderRadius: "10px", backgroundColor: "transparent", fontSize: "16px", cursor: "pointer"}}>Would you like to have some suggestions?</button>
                </div>
                <div onClick={() => {
                    setCurrentMessage(suggestion)
                    setSuggestion("")
                }} style={{width: "100%"}}>
                    <button style={{display: `${suggestion === "" ? "none": "inline"}`, margin: "10px 0px 10px 30px", padding: "10px 20px", borderRadius: "10px", backgroundColor: "transparent", fontSize: "16px", cursor: "pointer"}}>{suggestion}</button>
                </div>
                <div style={{ height: "40px", border: "1px solid #263238", display: "flex" }}>
                    <input
                        style={{
                            height: "100%",
                            flex: "85%",
                            border: "0",
                            padding: "0 0.7em",
                            fontSize: "1em",
                            borderRight: "1px dotted #607d8b",
                            outline: "none"
                        }}
                        type="text"
                        value={currentMessage}
                        placeholder="Hey..."
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && checkAndSendMessage();
                        }}
                    />
                    <button style={{
                        border: "0",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                        flex: "15%",
                        height: "100%",
                        backgroundColor: "transparent",
                        outline: "none",
                        fontSize: "25px",
                        color: "green"
                    }} onClick={checkAndSendMessage}>&#9658;</button>
                </div>
            </div>
        </div>
    )
}
