import React from 'react';
import User from "./User";
import Channel from "../Channel/Channel";
import UserOnline from "./UserOnline";
import { Trans } from 'react-i18next';

interface IProps {
    locale: string;
    user: User;
    channels: any;
    channel: number;
    users: {};
    changeChannel(par1: number): void;
    messagesOnOtherChannels: {};
}

class UsersList extends React.Component<IProps, any> {
    private user: User;
    constructor(props: IProps) {
        super(props);
        this.user = props.user;
    }

    channels() {
        const channelList:any[] = [];
        let props = this.props;
        const channelsList = this.props.channels;
        Object.keys(channelsList).forEach(function (key, i) {
            channelList[i] = <Channel messages={props.messagesOnOtherChannels[key]} name={channelsList[key]} channelKey={parseInt(key)} key={key} channel={props.channel} handleClick={props.changeChannel}/>;
        });
        return channelList;
    }

    usersOnline() {
        const usersList:any[] = [];
        const users = this.props.users;
        const user = this.props.user;
        usersList[0] = <UserOnline afk={false} typing={false} userName={user.userName} key={user.userName} userRole={user.userRole} />;
        Object.keys(users).forEach(function (key, i) {
            if (user.userName !== users[key].userName) {
                usersList[i+1] = <UserOnline afk={users[key].afk} typing={users[key].typing} userName={users[key].userName} key={users[key].userName} userRole={users[key].userRole} />;
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
                             data-href="#channels" aria-expanded="true"><Trans>channel.list</Trans></div>
                        <div id="channels" className="collapse in">
                            {this.channels()}
                        </div>
                        <div className="text-bold info-text" role="button" data-toggle="collapse"
                             data-href="#users-box" aria-expanded="true"><Trans>user.online.list</Trans></div>
                        <div id="users-box" className="collapse in">
                            {/*<UserOnline userName={this.user.userName} userRole={this.user.userRole} />*/}
                            {this.usersOnline()}
                        </div>
                        <div className="logout">
                            {/*{% if is_granted('ROLE_ADMIN') %}*/}
                            {/*<a href="{{ path('chat_admin') }}" target="_blank">{{ 'panel'|trans }}</a>*/}
                            {/*{% endif %}*/}
                            <a href="path to logout" className="btn btn-success"><Trans>chat.logout</Trans></a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default UsersList;