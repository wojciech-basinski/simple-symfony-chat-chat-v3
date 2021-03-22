import React from "react";

class PrivateMessage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span className={'private-message'}>
                <>
                    {this.props.children}
                </>
            </span>
        );
    }
}
export default PrivateMessage;

