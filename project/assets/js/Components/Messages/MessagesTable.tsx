import React from "react";
import createDate from "../../Utils/Date/createDate";
import ChatMessageSameUser from "./ChatMessageSameUser";
import ChatMessageNewUser from "./ChatMessageNewUser";
import User from "../Users/User";
import IMessage from "./IMessage";

interface IProps {
    messages: IMessage[];
    user: User;
    insertPm: (par1:string) => void;
    insertNick: (par1:string) => void;
}

class MessagesTable extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
        this.messages = this.messages.bind(this);
        this.insertPm = this.insertPm.bind(this);
        this.insertNick = this.insertNick.bind(this);
    }

    insertPm(username: string):void  {
        this.props.insertPm(username);
    }

    insertNick(username: string): void {
        this.props.insertNick(username);
    }

    messages() {
        let messageList:any[] = [];
        let messagesList = this.props.messages;
        const user = this.props.user;
        let lastUserId = 0;
        let that = this;
        Object.keys(messagesList).forEach(function (key, i, channels) {
            const date = createDate(messagesList[i].date.date);
            const canDelete = (user.userRole === 'administrator' || user.userRole === 'moderator' || user.userRole === 'elders' || user.userRole === 'demotywatorking');
            const isPm = (messagesList[i].privateMessage);
            const canPmToUser = (messagesList[i].userName !== user.userName);
            if (lastUserId === messagesList[i].userId) {
                messageList[i] = <ChatMessageSameUser user={user} key={messagesList[i].id} message={messagesList[i]} canDelete={canDelete} isPm={isPm} date={date}/>;
            } else {
                messageList[i] = <ChatMessageNewUser user={user} insertNick={that.insertNick} insertPm={that.insertPm} key={messagesList[i].id} message={messagesList[i]} canDelete={canDelete} isPm={isPm} date={date} canPmToUser={canPmToUser}/>;
            }
            lastUserId = messagesList[i].userId;
        });
        return messageList;
    }

    render() {
        return this.messages();
    }
}

export default MessagesTable;