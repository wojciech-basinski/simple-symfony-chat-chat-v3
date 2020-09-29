import React from "react";

interface IProps {
    userId: number;
}

class MessageGroup extends React.Component<IProps, any>{
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div className="group-messages" data-user-id={this.props.userId}>
                {this.props.children}
            </div>
        )
    }
}

export default MessageGroup;