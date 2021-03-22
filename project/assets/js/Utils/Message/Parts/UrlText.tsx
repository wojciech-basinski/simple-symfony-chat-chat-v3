import React from "react";

interface IProps {
    text: string
}

class UrlText extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {
            text,
        } = this.props;

        return (
            <a href={text} target="_blank">{text}</a>
        );
    }
}
export default UrlText;

