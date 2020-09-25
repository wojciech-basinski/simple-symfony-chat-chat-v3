export default interface IMessage {
    id: number,
    userId: number,
    date,
    text: string,
    userName: string,
    userRole: string,
    userAvatar: string,
    privateMessage: boolean,
}