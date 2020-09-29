import React from 'react';
import BbCodeButton from './BbCodeButton';
import {BbCodesList} from "./BbCodesList";

interface IProps {
    onBbCodeClick: (par1: string) => void
}

interface IState {
}

export default class BbCodeTable extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
    }

    render() {
        const buttons = BbCodesList.map((name) => {
            return (<BbCodeButton bbCode={name} key={name} onClick={this.props.onBbCodeClick}/>)
        });

        return (
            <div className="col-xs-12" id="bbcode-row">
                <div className="row">
                    <div className="bbcode-div" id="bbcode">
                        {buttons}
                    </div>
                </div>
            </div>
        );
    }
};