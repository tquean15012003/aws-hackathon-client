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
    const [suggestion, setSuggestion] = useState([]);
    const [suggestionText, setSuggestionText] = useState([]);

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
        const context = getContext()

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "seeker": context.menteePreviousMessage,
            "supporter": context.currentMessage
        });

        console.log(raw)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch("http://54.255.161.39:8080/get_suggestion", requestOptions)
            .then(response => response.text())
            .then((result) => {
                let component = []
                const operations = JSON.parse(result).operations
                console.log(operations);
                let suggestionText = []
                for (let i = 0; i < operations.length; i++) {
                    const operation = operations[i]
                    switch (operation.operation) {
                        case "<INSERT>": {
                            suggestionText.push("");
                            component.push(
                                <span key={i}>
                                    <span onClick={() => {
                                        suggestionText[i] = operation.sentence
                                        component[i] = (<span style={{ color: "black" }} key={i}>{operation.sentence} </span>)
                                        setSuggestionText([...suggestionText])
                                        setSuggestion([...component])
                                    }}
                                    style={{
                                        border: "1px solid green",
                                        display: "inline",
                                        placeItems: "center",
                                        cursor: "pointer",
                                        height: "100%",
                                        outline: "none",
                                        fontSize: "20px",
                                        padding: "5px 10px",
                                        borderRadius: "10px",
                                        backgroundColor: "green",
                                        color: "white"
                                    }}>Add</span>
                                    <span style={{ color: "green" }} >{operation.sentence} </span>
                                </span>
                            )
                            break;
                        }
                        case "<NOOP>": {
                            suggestionText.push(operation.sentence);
                            component.push(<span style={{ color: "black" }} key={i}>{operation.sentence} </span>)
                            break;
                        }
                        case "<REPLACE>": {
                            suggestionText.push(operation.old_sentence);
                            component.push(
                                <span key={i}>
                                    <span onClick={() => {
                                        suggestionText[i] = operation.sentence
                                        component[i] = (<span style={{ color: "black" }} key={i}>{operation.sentence} </span>)
                                        setSuggestionText([...suggestionText])
                                        setSuggestion([...component])
                                    }}
                                        style={{
                                            border: "1px solid red",
                                            display: "inline",
                                            placeItems: "center",
                                            cursor: "pointer",
                                            height: "100%",
                                            outline: "none",
                                            fontSize: "20px",
                                            padding: "5px 10px",
                                            borderRadius: "10px",
                                            backgroundColor: "red",
                                            color: "white"
                                        }}>Delete</span><span style={{ color: "black" }}><s>{operation.old_sentence} </s></span> <span style={{ color: "green" }}>{operation.sentence} </span>
                                </span>
                            )
                            break;
                        }
                        default:
                            break;
                    }
                }
                setSuggestionText([...suggestionText])
                setSuggestion([...component])
            })
            .catch(error => console.log('error', error));

    }

    const checkAndSendMessage = async () => {
        if (currentMessage !== "") {
            if (username === "Mentor") {
                await axios({
                    url: "http://www.randomnumberapi.com/api/v1.0/randomnumber",
                    method: "GET",
                    // data: context
                })
                    .then(async (response) => {
                        if (100 > 50) {
                            alert("Your message may be harmful to the mentee")
                            setNeedHelp(true)
                            setSuggestion([])
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
                <div onClick={async () => {
                    await getSuggestion()
                    setNeedHelp(false)
                }} style={{ width: "100%" }}>
                    <button style={{ display: `${needHelp ? "inline" : "none"}`, margin: "10px 0px 10px 30px", padding: "10px 20px", borderRadius: "10px", backgroundColor: "transparent", fontSize: "16px", cursor: "pointer" }}>Would you like to have some suggestions?</button>
                </div>
                <div style={{ width: "100%" }}>
                    <div style={{ justifyContent: "space-between", alignItems: "center", border: "1px solid black", display: `${suggestion.length === 0 ? "none" : "flex"}`, margin: "10px 30px 10px 30px", padding: "10px 20px", borderRadius: "10px", fontSize: "16px" }}>
                        <p style={{ fontSize: "20px" }}>{suggestion}</p>
                        <button onClick={() => {
                            let text = ""
                            for (let i = 0; i < suggestionText.length; i++) {
                                text += (suggestionText[i] + " ")
                            }
                            setCurrentMessage(text)
                            setSuggestionText([])
                            setSuggestion([])
                        }} style={{
                            border: "1px solid transparent",
                            display: "grid",
                            placeItems: "center",
                            cursor: "pointer",
                            height: "100%",
                            outline: "none",
                            fontSize: "20px",
                            padding: "10px 20px",
                            borderRadius: "10px",
                            backgroundColor: "#205bec",
                            color: "white"
                        }}>Apply changes</button>
                    </div>
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
                        placeholder="Input your message"
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
