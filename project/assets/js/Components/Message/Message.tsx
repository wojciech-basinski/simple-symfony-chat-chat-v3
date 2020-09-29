import React from 'react';

interface IProps {
    messageText: string;
    handleChange: (par1: string) => void
    sendMessage: (par1?: string | undefined) => void
}

class Message extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    handleChange = (e):void => {
        this.props.handleChange(e.target.value);
    };

    handleKeyPress = (e): void => {
        if (e.which == 13 && !e.shiftKey) {
            e.preventDefault();
            this.props.sendMessage();
        }
    };


    render() {
        return (
            <div className="col-xs-12 margin-top-minus" id="text-row">
                <div className="row">
                    <div id="emoji-container"/>
                    <div className="col-xs-10">
                        <textarea autoFocus className="form-control" id="message-text" cols={50} rows={2} value={this.props.messageText} onKeyPress={this.handleKeyPress} onChange={this.handleChange}/>
                    </div>
                    <div className="col-xs-2">
                        <button className="btn btn-success btn-block" id="send" onClick={() => this.props.sendMessage()}>send trans</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Message;