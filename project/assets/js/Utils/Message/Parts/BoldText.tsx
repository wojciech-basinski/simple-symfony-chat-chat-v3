import React from "react";

interface IProps {
    text: string
}

class BoldText extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {
            text,
        } = this.props;

        return (
            <span className="text-bold">{text}</span>
        );
    }
}
export default BoldText;

