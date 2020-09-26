import React from 'react';

async function initialChat(path: string, channel: number = 0): Promise<any> {
    let body = {
        channel: channel
    };

    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    return postData(path, body);
}

export default initialChat;