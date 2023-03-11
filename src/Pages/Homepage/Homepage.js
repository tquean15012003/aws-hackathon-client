import React from 'react'
import HomeBody from './HomeBody'
import HomeHeader from './HomeHeader'

export default function Homepage(props) {
    const { socket } = props
    return (
        <div style={{ minHeight: "100vh" }}>
            <HomeHeader />
            <HomeBody socket={socket} />
        </div>
    )
}
