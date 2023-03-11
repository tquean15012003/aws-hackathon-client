import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setNameAndRoomAction } from '../../Redux/Actions'

export default function HomeBody(props) {

    const { socket } = props

    const navigate = useNavigate()

    const dispatch = useDispatch()

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "75vh" }}>
            <div>
                <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#1b4aef", textAlign: "center" }}>Introduction to the new Sesame</h1>
                <p style={{ fontSize: "32px", fontWeight: "bold", color: "black", textAlign: "center" }}>Together we get a better mental health.</p>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div>
                        <button onClick={() => {
                            dispatch(setNameAndRoomAction("Mentee", 1))
                            socket.emit("join_room", 1);
                            navigate('/chatbox', { replace: false })
                        }} style={{ marginLeft: "10px", cursor: "pointer", padding: "10px 20px", borderRadius: "10px", border: "solid 1px transparent", backgroundColor: "#1b4aef", fontSize: "24px", color: "white" }} type="button">
                            Join as Mentee
                        </button>
                        <button onClick={() => {
                            dispatch(setNameAndRoomAction("Mentor", 1))
                            socket.emit("join_room", 1);
                            navigate('/chatbox', { replace: false })
                        }} style={{ marginLeft: "10px", cursor: "pointer", padding: "10px 20px", borderRadius: "10px", border: "solid 1px transparent", backgroundColor: "#1b4aef", fontSize: "24px", color: "white" }} type="button">
                            Join as Mentor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
