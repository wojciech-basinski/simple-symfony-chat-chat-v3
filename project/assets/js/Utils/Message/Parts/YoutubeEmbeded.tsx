import React from "react";

interface IProps {
    text: string,
    youtubeHref: string
}

class YoutubeEmbeded extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const {
            text,
            youtubeHref
        } = this.props;
        return (
            <div>
                {"(youtube)"}<img className={"youtube pointer"} data-href={youtubeHref} src={"https://img.youtube.com/vi/" + text + "/hqdefault.jpg"} />
            </div>

        );
    }
}
export default YoutubeEmbeded;

