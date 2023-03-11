import React from 'react'

export default function HomeHeader() {
    return (
        <header style={{backgroundColor: "white", padding: "10px 0"}}>
            <div style={{margin: "auto", maxWidth: "1530px"}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <div className="flex justify-between items-center">
                        <a href='/' style={{textDecoration: "none", fontSize: "48px", color: "black", fontWeight: "bold"}}>
                            Se<span style={{color: "#205bec"}}>Same</span>
                        </a>
                    </div>
                    <div>
                        <button style={{marginLeft: "10px", cursor: "pointer", padding: "5px 20px", borderRadius: "10px", border: "solid 1px transparent", backgroundColor: "#1b4aef", fontSize: "24px", color: "white"}} type="button">
                            Login
                        </button>
                        <button style={{marginLeft: "10px", cursor: "pointer", padding: "5px 20px", borderRadius: "10px", border: "solid 1px transparent", backgroundColor: "#1b4aef", fontSize: "24px", color: "white"}} type="button">
                            SignUp
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
