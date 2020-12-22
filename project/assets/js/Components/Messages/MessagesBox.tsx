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
    private scroll;
    constructor(props: IProps) {
        super(props);
        this.scroll = React.createRef();
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<any>, snapshot?: any): void {
        console.log('abcd');
        this.scroll.current.scrollTo(100, 100);//TODO
    }

    shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<any>, nextContext: any): boolean {
        return nextProps.messages.length !== this.props.messages.length;
    }

    render() {
        return (
            <div className="col-xs-7 col-md-10" id="messages">
                <div className="panel panel-success" id="panel-messages">
                     <div className="panel-body panel-messages no-padding">
                            <div id="messages-box">
                                <MessagesTable insertNick={this.props.insertNick} insertPm={this.props.insertPm} messages={this.props.messages} user={this.props.user}/>
                                <div className="scroll-messages" ref={this.scroll}/>
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MessagesBox;