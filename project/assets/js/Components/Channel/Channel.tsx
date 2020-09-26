import React from "react";

interface IProps {
    name: string;
    channelKey: number;
    channel: number;
    handleClick(par1: number): void;
}

class Channel extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div onClick={() => this.props.handleClick(this.props.channelKey)} className={"text-in-info channel " + (this.props.channel === this.props.channelKey ? "active" : "")} data-value={this.props.channelKey}>{this.props.name}</div>
        );
    }
}

export default Channel;