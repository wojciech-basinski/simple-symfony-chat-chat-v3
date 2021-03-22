import React from "react";

interface IProps {
    text: string
}

class ItalicText extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {
            text,
        } = this.props;

        return (
            <span className="text-italic">{text}</span>
        );
    }
}
export default ItalicText;

