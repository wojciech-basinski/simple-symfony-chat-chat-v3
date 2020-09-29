import React from 'react';
import ReactDOM from 'react-dom';
import Main from "./Components/Main";
import User from "./Components/Users/User";

declare global {
    interface Window {
        reactProps: {
            sendPath: string;
            user: User;
            botId: number;
            languagePath: object;
            changeChannelPath: string;
            locale: string;
        }
    }
}

ReactDOM.render(
    <Main props={window.reactProps}/>,
    document.getElementById('root')
);

Notification.requestPermission();