import React from 'react';

interface IProps {
    source: string,
    text: string,
    handleClick: (par1: string) => void
}

class EmoticonImg extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <img src={this.props.source} className="emoticon-img pointer" alt={this.props.text} onClick={() => this.props.handleClick(this.props.text)}/>
        )
    }
}


export default EmoticonImg;