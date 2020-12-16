import User from "./../../Components/Users/User";
import React from 'react';

async function sendMessage(message: string, sendPath: string, user: User, channel: number): Promise<any> {
    let body = {
        channel: channel,
        text: message
    };

    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.reactProps.token
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    return postData(sendPath, body);
}

export default sendMessage;