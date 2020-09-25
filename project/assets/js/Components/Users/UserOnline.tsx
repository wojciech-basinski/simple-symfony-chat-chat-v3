import React from 'react';

interface IProps {
    userName: string;
    userRole: string;
    typing: boolean;
}

class UserOnline extends React.Component<IProps, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.userRole + ' text-in-info'} id="username">{this.props.userName}{this.props.typing ? '(...)' : null}</div>
        );
    }
}

export default UserOnline;