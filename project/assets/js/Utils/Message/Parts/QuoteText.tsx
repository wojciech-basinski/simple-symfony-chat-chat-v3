import React from "react";

interface IProps {
    text: string
}

class QuoteText extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {
            text,
        } = this.props;

        return (
            <span><blockquote><p>{text}</p></blockquote><br /></span>
        );
    }
}
export default QuoteText;

