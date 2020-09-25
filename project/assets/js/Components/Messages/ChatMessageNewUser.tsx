import React from "react";
import {getAvatarUrl} from "../../Utils/Avatar/AvatarUrl";
import {dateGetHours, dateGetMinutes, dateGetSeconds} from "../../Utils/Date/DateOperations";
import {parseMessage} from "../../Utils/Message/ParseMessage";
import Parser from 'html-react-parser';
import IMessage from "./IMessage";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import User from "../Users/User";

interface IProps {
    message: IMessage;
    date: any;
    canDelete: boolean;
    isPm: boolean;
    canPmToUser: boolean;
    insertPm: (par1: string) => void;
    insertNick: (par1: string) => void;
    user: User;
}

class ChatMessageNewUser extends React.Component<IProps, any>{
    constructor(props: IProps) {
        super(props);
        this.insertPm = this.insertPm.bind(this);
        this.insertNick = this.insertNick.bind(this);
    }

    insertPm(): void {
        this.props.insertPm(this.props.message.userName);
    }

    insertNick(): void {
        this.props.insertNick(this.props.message.userName);
    }

    render() {
        const message = this.props.message;
        const messageId = message.id;
        const userId = message.userId;
        const userName = message.userName;
        const userRole = message.userRole;
        const date = this.props.date;
        const avatarUrl = getAvatarUrl(message.userAvatar);
        const canDelete = this.props.canDelete ? <span className="pull-right kursor" data-id={messageId}>&times;</span> : null;

        return(
            <div className="group-messages" data-user-id={userId}>
                <div data-id={messageId} data-user-id={userId}>
                    <img className="avatar" src={avatarUrl} alt={"avatar"}/>
                    <div>
                        <div className="presentation">
                            {this.props.canPmToUser ? <span className="icon-mail pointer" data-value={userName} onClick={this.insertPm}/> : null}
                            <span onClick={this.insertNick} className={userRole + ' text-bold nick pointer'}>{userName}</span>
                            <OverlayTrigger placement="top" overlay={<Tooltip className={"in"} placement="top" id="tooltip">{dateGetHours(date) + ':' + dateGetMinutes(date) + ':' + dateGetSeconds(date)}</Tooltip>}>
                                <span className="date">{dateGetHours(date) + ':' + dateGetMinutes(date)}</span>
                            </OverlayTrigger>
                        </div>
                        <div className="message message-text padding-left">
                            {Parser(parseMessage(this.props.message.text, this.props.isPm, this.props.user))}
                            {canDelete}
                        </div>
                    </div>
                    <div className="clearfix"/>
                </div>
            </div>
        );
    }
}

export default ChatMessageNewUser;