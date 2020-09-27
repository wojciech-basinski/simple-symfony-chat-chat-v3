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


// ReactDOM.render(
//     <BbCodeTable />,
//     document.getElementById('root')
// );


// ERROR  Failed to compile with 1 errors                                                                                                                                                                                                              12:31:41 AM
//
// Error loading ./assets/js/chat.tsx
//
// FIX  To process TypeScript files:
//     1. Add Encore.enableTypeScriptLoader() to your webpack.config.js file.
// 2. Install typescript & ts-loader to use enableTypeScriptLoader()
// yarn add typescript ts-loader@^5.3.0 --dev
