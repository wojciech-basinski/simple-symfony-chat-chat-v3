import React from 'react';

interface IProps {
    source: string,
    text: string,
    handleClick: (par1: string) => void
}
interface IState {
}

class EmoticonImg extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(): void {
        this.props.handleClick(this.props.text);
    }

    render() {
        return (
            <img src={this.props.source} className="emoticon-img kursor" alt={this.props.text} onClick={this.handleClick}/>
        )
    }
}


export default EmoticonImg;