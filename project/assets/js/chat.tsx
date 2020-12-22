import React from 'react';
import ReactDOM from 'react-dom';
import Main from "./Components/Main";
import User from "./Components/Users/User";
import { I18nextProvider } from 'react-i18next';
import i18n from './Locale/i18n';
import  '../css/chat.scss';

declare global {
    interface Window {
        reactProps: {
            sendPath: string;
            user: User;
            botId: number;
            languagePath: object;
            changeChannelPath: string;
            locale: string;
            token: string;
        }
    }
}

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <Main props={window.reactProps}/>
    </I18nextProvider>,
    document.getElementById('root')
);

Notification.requestPermission();