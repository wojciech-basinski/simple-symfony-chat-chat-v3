import React from 'react';

interface IProps {
    bbCode: string
    onClick: (par1: string) => void
}

export default class BbCodeButton extends React.Component<IProps, any> {
    constructor(props) {
        super(props);
    }

    render() {
        //todo add tooltip
        return <button onClick={() => this.props.onClick(this.props.bbCode)} className="btn btn-success" data-toggle="tooltip" //poprawić translacje
                       data-title={this.props.bbCode}>{this.props.bbCode}</button>
    }
}