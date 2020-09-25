import React from "react";
import BbCodeTable from './BbCode/BbCodeTable';
import MessagesBox from "./Messages/MessagesBox";
import UsersList from "./Users/UsersList";
import EmoticonsList from "./Emoticons/EmoticonsList";
import SettingsList from "./Settings/SettingsList";
import Message from "./Message/Message";
import User from "./Users/User";
import sendMessage from "../Utils/Message/SendMessage";
import ErrorModal from "./Modal/ErrorModal";
import initialChat from "../Utils/Chat/InitialChat";
import socketIOClient from "socket.io-client";
import playSound from "../Utils/Sound/playSound";
import {ROLL_COOLDOWN, SOCKET_PATH} from "../Utils/Chat/ChatConfig"
import IMessage from "./Messages/IMessage";

interface IState {
    messageText: string;
    user: User;
    locale: string;
    isWindowInFocus: boolean;
    modal: boolean;
    modalMessage: string;
    channels: {},
    channel: number;
    messages: any;
    chatInitialized: boolean;
    rollDisabled: boolean;
    settings: {
        sound: boolean,
        scroll: boolean
    },
    status: string,
    typing: boolean,
    usersOnline: {},
    afk: boolean
}

class Main extends React.Component<any, IState> {
    private socket:socketIOClient = socketIOClient(SOCKET_PATH);
    private newMessagesCount:number = 0;
    private documentTitle: string = document.title;
    constructor(props: any) {
        super(props);
        this.state = {
            isWindowInFocus: true,
            messageText : "",
            user: props.props.user,
            locale: props.props.locale,
            modal: false,
            modalMessage: '',
            channels: {},
            channel: props.props.channel,
            messages: [],
            chatInitialized: false,
            rollDisabled: false,
            settings: {
                sound: false,
                scroll: false
            },
            status: 'in-progress',
            typing: false,
            usersOnline:{},
            afk: false
        };
        this.handleAddBbCodeToMessageText = this.handleAddBbCodeToMessageText.bind(this);
        this.handleChangeMessageText = this.handleChangeMessageText.bind(this);
        this.handleAddEmoticonToMessageText = this.handleAddEmoticonToMessageText.bind(this);
        this.sendMessageCall = this.sendMessageCall.bind(this);
        this.sendRoll = this.sendRoll.bind(this);
        this.unlockRoll = this.unlockRoll.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.sockets = this.sockets.bind(this);
        this.insertPm = this.insertPm.bind(this);
        this.insertNick = this.insertNick.bind(this);
        this.initialSettings = this.initialSettings.bind(this);
        this.handleChangeSound = this.handleChangeSound.bind(this);
        this.handleChangeScroll = this.handleChangeScroll.bind(this);
        this.saveSettingsInLocalStorage = this.saveSettingsInLocalStorage.bind(this);
        this.refreshUserOnSocket = this.refreshUserOnSocket.bind(this);
        this.sockets();
    }

    refreshUserOnSocket() {
        this.socket.emit("refreshUsers", {
            "userRole": this.state.user.userRole,
            "userName": this.state.user.userName,
            "typing": this.state.typing,
            "afk": this.state.afk
        });
        console.log("refresh");
        setTimeout(this.refreshUserOnSocket, 60000);
    }

    sockets() {
        this.socket.on("connect", () => {
            this.socket.emit("room", [
                1
            ]);
            this.socket.emit("room", [
                this.props.props.privateMessageChannelId
            ]);
            this.refreshUserOnSocket();

        });
        this.socket.on("users", (data) => {
            this.setState({
                usersOnline: data
            });
        });
        this.socket.on("message", (data: IMessage) => {
            //change channel!!!!
            if (!this.state.isWindowInFocus) {
                this.newMessagesCount++;
                document.title = '(' + this.newMessagesCount + ') ' + this.documentTitle;
                if (Notification.permission === "granted") {
                    const username = data.userName;
                    const messageText = data.text;
                    const notification = new Notification(username, {'body': messageText});
                    setTimeout(notification.close.bind(notification), 5000);
                }
            }
            this.setState((prevState) => {
                const newMessages = prevState.messages;
                if (data.userId !== this.state.user.userId) {
                    if (this.state.settings.sound) {
                        playSound(this.props.props.messageSounds.newMessageSound);
                    }
                }
                newMessages[newMessages.length] = data;
                    return {
                        messages: newMessages
                    }
                });
        });
        //channele do których dołączono
        //sockety todo
    }

    componentDidMount(): void {
        window.addEventListener('blur', () => {
            this.setState({
                isWindowInFocus: false
            });
            //set afk
        });
        window.addEventListener('focus', () => {
            this.setState({
                isWindowInFocus: true
            });
            this.newMessagesCount = 0;
            document.title = this.documentTitle;
            //set return from afk
        });

        initialChat(this.props.props.initialPath)
            .then(data => {
                this.setState({
                        channels: data.channels,
                        messages: data.messages,
                        chatInitialized: true,
                        status: 'ok'
                    }
                );
            });
        this.initialSettings();
    }

    // componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<IState>, snapshot?: any): void {
    //     console.log(this.state.isWindowInFocus);
    // }

    initialSettings(): void {
        const settings = localStorage.getItem('settings');
        if (settings === null) {
            this.saveSettingsInLocalStorage();
        } else {
            this.setState({
                settings:  JSON.parse(settings)
                }
            )
        }
    }

    handleChangeSound() {
        this.setState(prevState => {
            return {
                settings: {
                    sound: !prevState.settings.sound,
                    scroll: prevState.settings.scroll
                }
            }
        }, this.saveSettingsInLocalStorage);
    }

    handleChangeScroll() {
        this.setState(prevState => {
            return {
                settings: {
                    sound: prevState.settings.sound,
                    scroll: !prevState.settings.scroll
                }
            }
        }, this.saveSettingsInLocalStorage);
    }

    saveSettingsInLocalStorage(): void {
        let settings = this.state.settings;
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    toggleModal(message: string|undefined = undefined): void {
        const messageText: string = message ?? '';
        this.setState(prevState => {
            return {
                modalMessage: messageText,
                modal: !(prevState.modal)
            }
        });
    }

    sendRoll(): void {
        if (!this.state.rollDisabled) {
            this.sendMessageCall('/roll 2d100');
            this.setState({
                rollDisabled: true
            });
            setTimeout(this.unlockRoll, ROLL_COOLDOWN)
        }
    }

    unlockRoll() {
        this.setState({
            rollDisabled: false
        });
    }

    sendMessageCall(message: string | undefined = undefined): void {
        if (message === undefined && this.state.messageText.trim() === '') {
            return;
        }
        let messageText = message !== undefined ? message : this.state.messageText.trim();
        let errorMessage = sendMessage(messageText, this.props.props.sendPath, this.state.user, this.props.props.channel);
        errorMessage.then(data => {
           if (data.errorMessage !== undefined) {
               this.toggleModal(data.errorMessage);
               return;
           }
        });
        if (message === undefined) {
            if (this.state.settings.sound) {
                playSound(this.props.props.messageSounds.sendMessageSound);
            }
            this.handleChangeMessageText('');
        }
    }

    handleAddText(addedText: string): void {
        this.handleSendTypingMessage(addedText);
        this.setState(prevState => {
            return {
                messageText: prevState.messageText + addedText
            }
        });
    }
    //TODO ustawić kursor w środku bbcode
    handleAddBbCodeToMessageText(addedBbCode: string): void {
        this.handleAddText(addedBbCode);
    };
    //TODO ustawić kursor za emoticoną
    handleAddEmoticonToMessageText(addedEmoticon: string): void {
        this.handleAddText(addedEmoticon);
    };

    handleSendTypingMessage(message: string) {
        if (message.search('/priv') !== -1 || message.search('/msg') !== -1) {
            this.setState({
                typing: false
            });
            console.log('send not typing');
            this.socket.emit("typing", {
                typing: false,
                userName: this.state.user.userName
            });
            return;
        }
        if (!this.state.typing && message !== '') {
            console.log('send typing');
            this.socket.emit("typing", {
                typing: true,
                userName: this.state.user.userName
            });
            this.setState({
                typing: true
            });
        }
    }

    handleChangeMessageText(message: string): void {
        this.handleSendTypingMessage(message);
        this.setState({
            messageText: message
        });
        if (message === '') {
            console.log('emit not typing');
            this.socket.emit("typing", {
                typing: false,
                userName: this.state.user.userName
            });
            this.setState({
                typing: false
            });
        }
    }

    insertPm(username: string): void {
        this.handleChangeMessageText('/priv ' + username + ' ');
    }

    insertNick(username: string): void {
        this.handleAddText('@' + username + ' ');
    }

    render() {
        return (
            <div className="row chat" id="chat-row-main">
                <ErrorModal modal={this.state.modal} toggleModal={this.toggleModal} message={this.state.modalMessage}/>
                <MessagesBox messages={this.state.messages} user={this.state.user} insertPm={this.insertPm} insertNick={this.insertNick}/>
                <UsersList users={this.state.usersOnline} locale={this.state.locale} user={this.state.user} channels={this.state.channels} channel={this.state.channel}/>
                <EmoticonsList handleEmoticonClick={this.handleAddEmoticonToMessageText} handleRollClick={this.sendRoll} rollDisabled={this.state.rollDisabled}/>
                <SettingsList status={this.state.status} settings={this.state.settings} handleChangeScroll={this.handleChangeScroll} handleChangeSound={this.handleChangeSound}/>
                <BbCodeTable onBbCodeClick={this.handleAddBbCodeToMessageText}/>
                <Message messageText={this.state.messageText} handleChange={this.handleChangeMessageText} sendMessage={this.sendMessageCall}/>
            </div>
        );
    };
}

export default Main;