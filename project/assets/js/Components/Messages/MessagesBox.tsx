import React from 'react';
import User from "../Users/User";
import MessagesTable from "./MessagesTable";
import IMessage from "./IMessage";

interface IProps {
    messages: IMessage[];
    user: User;
    insertPm: (par1: string) => void;
    insertNick: (par1: string) => void;
}

class MessagesBox extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div className="col-xs-7 col-md-10" id="messages">
                <div className="panel panel-success" id="panel-messages">
                     <div className="panel-body panel-messages no-padding">
                            <div id="messages-box">
                                {this.props.messages ? <MessagesTable insertNick={this.props.insertNick} insertPm={this.props.insertPm} messages={this.props.messages} user={this.props.user}/> : null}
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MessagesBox;