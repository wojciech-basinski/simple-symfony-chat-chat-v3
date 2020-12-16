import React from 'react';

async function initialChat(path: string, channel: number = 0): Promise<any> {
    let pathWithQuery = path + '?channel=' + channel;

    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.reactProps.token
            }
        });
        return response.json();
    }

    return postData(pathWithQuery);
}

export default initialChat;