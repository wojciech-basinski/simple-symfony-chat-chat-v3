import React from "react";

interface IProps {
    text: string
}

class TextPart extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {
            text,
        } = this.props;

        return (
            <span>{text}</span>
        );
    }
}
export default TextPart;

