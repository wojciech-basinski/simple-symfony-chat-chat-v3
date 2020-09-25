import React from 'react';

async function initialChat(path: string): Promise<any> {
    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return response.json();
    }

    return postData(path/*, body*/);
}

export default initialChat;