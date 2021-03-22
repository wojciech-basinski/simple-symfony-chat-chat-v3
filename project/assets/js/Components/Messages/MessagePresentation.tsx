import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {dateGetHours, dateGetMinutes, dateGetSeconds} from "../../Utils/Date/DateOperations";
import Parser from "html-react-parser";
import IMessage from "./IMessage";
import User from "../Users/User";
import {getAvatarUrl} from "../../Utils/Avatar/AvatarUrl";
import {parseMessage} from "../../Utils/Message/ParseMessage";

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

export default class MessagePresentation extends React.Component<IProps, any>{
    constructor(props:IProps) {
        super(props);
        this.state = { hasError: false };
    }

    render() {
        if (this.state.hasError) {
            return <div>Problem z wyświetleniem wiadomości</div>;
        }
        const message = this.props.message;
        const messageId = message.id;
        const userId = message.userId;
        const userName = message.userName;
        const userRole = message.userRole;
        const date = this.props.date;
        const avatarUrl = getAvatarUrl(message.userAvatar);
        const canDelete = this.props.canDelete ? <span className="pull-right kursor" data-id={messageId}>&times;</span> : null;
        return(
            <div data-id={messageId} data-user-id={userId}>
                <img className="avatar" src={avatarUrl} alt={"avatar"}/>
                <div>
                    <div className="presentation">
                        {this.props.canPmToUser ? <span className="icon-mail pointer" data-value={userName} onClick={() => this.props.insertPm(userName)}/> : null}
                        <span onClick={() => this.props.insertNick(userName)} className={userRole + ' text-bold nick pointer'}>{userName}</span>
                        <OverlayTrigger placement="top" overlay={<Tooltip className={"in"} placement="top" id="tooltip">{dateGetHours(date) + ':' + dateGetMinutes(date) + ':' + dateGetSeconds(date)}</Tooltip>}>
                            <span className="date">{dateGetHours(date) + ':' + dateGetMinutes(date)}</span>
                        </OverlayTrigger>
                    </div>
                    <div className="message message-text padding-left">
                        <>
                            {parseMessage(this.props.message.text, this.props.isPm, this.props.user)}
                        </>
                        {canDelete}
                    </div>
                </div>
                <div className="clearfix"/>
            </div>
        )
    }
}