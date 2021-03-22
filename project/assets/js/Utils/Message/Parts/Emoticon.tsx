import React from "react";

interface IProps {
    text: string,
    src: string
}

class Emoticon extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {
            text,
            src
        } = this.props;

        return (
            <span>
                <img className="emoticon-text" src={src}
                     alt={text} />
            </span>

        );
    }
}
export default Emoticon;

