import React from "react";

interface IProps {
    text: string
}

class ImagePart extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    openBBImgInNewWindow = (e) => {
        window.open(e.target.src, '_blank');
    };

    render() {
        const {
            text,
        } = this.props;

        return (
            <span><img className={"bbcode-img pointer"} alt={text} src={text} onClick={this.openBBImgInNewWindow}/></span>
        );
    }
}
export default ImagePart;

