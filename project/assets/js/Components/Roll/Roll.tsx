import React from "react";
import {ROLL_IMG} from "./constants/Constants";

interface IProps {
    rollDisabled: boolean;
    handleClick: () => void;
}

class Roll extends React.Component<IProps, any> {
    constructor(props:IProps) {
        super(props);
    }

    render() {
        return (
            <img className={"emoticon-text " + (this.props.rollDisabled ? 'disabled' : 'pointer')} id="roll-img" alt="roll" src={ROLL_IMG} onClick={this.props.handleClick}/>
        );
    }

}

export default Roll;