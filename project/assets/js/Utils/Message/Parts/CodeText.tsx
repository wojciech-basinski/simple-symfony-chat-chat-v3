import React from "react";

interface IProps {
    text: string
}

class CodeText extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {
            text,
        } = this.props;

        return (
            <span><code>{text}</code></span>
        );
    }
}
export default CodeText;

