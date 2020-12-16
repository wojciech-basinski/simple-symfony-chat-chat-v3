import React from "react";
import { Trans } from 'react-i18next';

interface IProps {
    name: string;
    channelKey: number;
    channel: number;
    handleClick(par1: number): void;
    messages: number;
}

class Channel extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div onClick={() => this.props.handleClick(this.props.channelKey)}
                 className={"text-in-info channel " + (this.props.channel === this.props.channelKey ? "active" : "")}
                 data-value={this.props.channelKey}>
                <Trans>{'channel.' + this.props.name}</Trans>
                {this.props.messages ? "(" + this.props.messages + ")" : null}
            </div>
        );
    }
}

export default Channel;