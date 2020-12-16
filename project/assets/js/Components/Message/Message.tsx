import React from 'react';
import { Trans } from 'react-i18next';

interface IProps {
    messageText: string;
    handleChange: (par1: string) => void
    sendMessage: (par1?: string | undefined) => void
}

class Message extends React.Component<IProps, any> {
    private textArea;
    constructor(props: IProps) {
        super(props);
        this.textArea = React.createRef();
    }

    focusTextarea = () => {
        this.textArea.current.focus();
    };

    componentDidUpdate(): void {
        this.focusTextarea();
    }

    shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<any>, nextContext: any): boolean {
        return nextProps.messageText !== this.props.messageText;
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
                        <textarea autoFocus ref={this.textArea} className="form-control" id="message-text" cols={50} rows={2} value={this.props.messageText} onKeyPress={this.handleKeyPress} onChange={this.handleChange}/>
                    </div>
                    <div className="col-xs-2">
                        <button className="btn btn-success btn-block" id="send" onClick={() => this.props.sendMessage()}><Trans>chat.send</Trans></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Message;