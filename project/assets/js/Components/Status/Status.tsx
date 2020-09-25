import React from "react";

interface IProps {
    status: string;
}

export default class Status extends React.Component<IProps, any> {
    constructor(props:IProps) {
        super(props);
    }

    render() {
        return (<div className={this.props.status + " status"}/>)
    }
}