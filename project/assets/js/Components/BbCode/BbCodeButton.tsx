import React from 'react';

interface IProps {
    bbCode: string
    onClick: (par1: string) => void
}

interface IState {
    bbCode: string
}

export default class BbCodeButton extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            bbCode: props.bbCode
        };

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    private handleOnClick() {
        this.props.onClick('[' + this.state.bbCode + '][/' + this.state.bbCode + ']');
    }

    render() {
        return <button onClick={this.handleOnClick} className="btn btn-success" data-toggle="tooltip" //poprawić translacje
                       data-title={this.state.bbCode} data-bbcode={this.state.bbCode}>{this.state.bbCode}</button>
    }
}