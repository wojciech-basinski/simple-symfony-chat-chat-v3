import React from "react";
import createDate from "../../Utils/Date/createDate";
import User from "../Users/User";
import IMessage from "./IMessage";
import Message from "./Message";
import MessagePresentation from "./MessagePresentation";
import MessageGroup from "./MessageGroup";

interface IProps {
    messages: IMessage[];
    user: User;
    insertPm: (par1:string) => void;
    insertNick: (par1:string) => void;
}

class MessagesTable extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    messages() {
        let messageList:any[] = [];
        let messagesList = this.props.messages;
        const user:User = this.props.user;
        let lastUserId:number = 0;
        let that = this;
        let group:any[] = [];
        let lastMessageId:number = 0;
        Object.keys(messagesList).forEach(function (key, i, channels) {
            const date = createDate(messagesList[i].date.date);
            const canDelete = (user.userRole === 'administrator' || user.userRole === 'moderator');
            const isPm = (messagesList[i].privateMessage);
            const canPmToUser = (messagesList[i].userName !== user.userName);
            if (lastUserId === messagesList[i].userId) {
                group.push(<Message user={user} key={messagesList[i].id} message={messagesList[i]} canDelete={canDelete} isPm={isPm} date={date}/>);
            } else {
                messageList.push(<MessageGroup key={messagesList[i].id} userId={lastUserId}>{group}</MessageGroup>);
                group = [];
                group.push(<MessagePresentation insertNick={that.props.insertNick} insertPm={that.props.insertPm} user={user} canPmToUser={canPmToUser} key={messagesList[i].id} message={messagesList[i]} canDelete={canDelete} isPm={isPm} date={date}/>);
            }
            if (!group.length) {
                messageList.push(<MessageGroup key={messagesList[i].id} userId={lastUserId}>{group}</MessageGroup>);
            }
            lastUserId = messagesList[i].userId;
            lastMessageId = messagesList[i].id;
        });
        messageList.push(<MessageGroup key={lastMessageId} userId={lastUserId}>{group}</MessageGroup>);
        return messageList;
    }

    render() {
        return this.messages();
    }
}

export default MessagesTable;