import React from 'react';
import User from "./User";
import Channel from "../Channel/Channel";
import UserOnline from "./UserOnline";

interface IProps {
    locale: string;
    user: User;
    channels: any;
    channel: number;
    users: {};
}

class UsersList extends React.Component<IProps, any> {
    private user: User;
    constructor(props: IProps) {
        super(props);
        this.user = props.user;
        this.channels = this.channels.bind(this);
        this.usersOnline = this.usersOnline.bind(this);
    }

    channels() {
        const channelList:any[] = [];
        let props = this.props;
        const channelsList = this.props.channels;
        Object.keys(channelsList).forEach(function (key, i) {
            channelList[i] = <Channel name={channelsList[key]} channelKey={parseInt(key)} key={key} channel={props.channel}/>;
        });
        return channelList;
    }

    usersOnline() {
        const usersList:any[] = [];
        const users = this.props.users;
        const user = this.props.user;
        usersList[0] = <UserOnline typing={false} userName={user.userName} key={user.userName} userRole={user.userRole} />;
        Object.keys(users).forEach(function (key, i) {
            if (user.userName !== users[key].userName) {
                usersList[i+1] = <UserOnline typing={users[key].typing} userName={users[key].userName} key={users[key].userName} userRole={users[key].userRole} />;
            }
        });
        return usersList;
    }

    render() {
        return (
            <div className="col-xs-5 col-md-2" id="online-users">
                <div className="panel panel-success panel-no-padding" id="panel-users">
                    <div className="panel-body no-padding">
                        <div className="text-bold info-text" role="button" data-toggle="collapse"
                             data-href="#collapseLanguage" aria-expanded="true">lang trans:</div>
                        <div id="collapseLanguage" className="collapse">
                            <div className="text-in-info language {{ locale == 'pl' ? 'active' }}" data-value="pl">PL</div>
                            <div className="text-in-info language {{ locale == 'en' ? 'active' }}" data-value="en">EN</div>
                        </div>
                        <div className="text-bold info-text" role="button" data-toggle="collapse"
                             data-href="#channels" aria-expanded="true">channel trans:</div>
                        <div id="channels" className="collapse in">
                            {this.channels()}
                        </div>
                        <div className="text-bold info-text" role="button" data-toggle="collapse"
                             data-href="#users-box" aria-expanded="true">online trans:</div>
                        <div id="users-box" className="collapse in">
                            {/*<UserOnline userName={this.user.userName} userRole={this.user.userRole} />*/}
                            {this.usersOnline()}
                        </div>
                        <div className="logout">
                            {/*{% if is_granted('ROLE_ADMIN') %}*/}
                            {/*<a href="{{ path('chat_admin') }}" target="_blank">{{ 'panel'|trans }}</a>*/}
                            {/*{% endif %}*/}
                            <a href="path to logout" className="btn btn-success">logout trans</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default UsersList;