import React from "react";
import {dateGetHours, dateGetMinutes, dateGetSeconds} from "../../Utils/Date/DateOperations";
import {parseMessage} from "../../Utils/Message/ParseMessage";
import ReactHtmlParser from 'html-react-parser';
import IMessage from "./IMessage";
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import User from "../Users/User";
import replace from "../../Utils/Message/MessageReplace";

interface IProps {
    message: IMessage;
    date: any;
    canDelete: boolean;
    isPm: boolean;
    user: User;
}

class ChatMessageSameUser extends React.Component<IProps, any>{
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            return <div>Problem z wyświetleniem wiadomości</div>;
        }
        const messageId = this.props.message.id;
        const userId = this.props.message.userId;
        const date = this.props.date;
        const canDelete = this.props.canDelete ? <span className="pull-right kursor" data-id={messageId}>&times;</span> : null;
        return(
            <div data-id={messageId} data-user-id={userId}>
                <OverlayTrigger placement="top" overlay={<Tooltip className={"in"} placement="top" id="tooltip">{dateGetHours(date) + ':' + dateGetMinutes(date) + ':' + dateGetSeconds(date)}</Tooltip>}>
                    <div className="date-hidden">{dateGetHours(date) + ':' + dateGetMinutes(date)}</div>
                </OverlayTrigger>
                <div className="message message-text padding-left">
                    {ReactHtmlParser(parseMessage(this.props.message.text, this.props.isPm, this.props.user), {
                        replace: (
                            ({attribs}) => {
                                return replace(attribs)
                            })
                    })}
                    {canDelete}
                </div>
                <div className="clearfix"/>
            </div>
        );
    }
}

export default ChatMessageSameUser;