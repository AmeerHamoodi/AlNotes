import React, { useState } from "react";

type props = {
    name: string,
    keyCode: string
}

const Display = ({ name, keyCode }: props) => {
    const [keyCodeValue, setKeyCodeValue] = useState(keyCode);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        console.log(target.value);
        setKeyCodeValue(target.value);
    }

    return (
        <div className="ui item grid" style={{alignItems: "center", justifyContent:"center"}}>
            <div className="two column row">
                <div className="column">
                    <b style={{marginRight: "2em"}}>{name}:</b><b>{keyCode}</b>
                </div>
                <div className="column">
                    <div className="ui form">
                        <div className="field">
                            <input type="text" placeholder="Hit the 'meta keys' (like CTRL, ALT, SHIFT ...) and key involved in your shortkey" 
                            value={keyCodeValue} onChange={handleChange} /*onKeyUp={(e) => {
                                const target = e.target as HTMLInputElement;
                                setKeyCodeValue(target.value);
                            }}*//>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Display;