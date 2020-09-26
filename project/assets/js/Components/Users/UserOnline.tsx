import React from 'react';

interface IProps {
    userName: string;
    userRole: string;
    typing: boolean;
    afk: boolean;
}

class UserOnline extends React.Component<IProps, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.userRole + ' text-in-info'} id="username">
                {this.props.userName}
                {this.props.typing ? '(...)' : null}
                {this.props.afk ? '(afk)' : null}
            </div>
        );
    }
}

export default UserOnline;