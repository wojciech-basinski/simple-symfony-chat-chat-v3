import React from 'react';
import {emoticonsImages, emoticonsText} from "./constants/Constants";
import EmoticonImg from "./EmoticonImg";
import Roll from "../Roll/Roll";

interface IProps {
    handleEmoticonClick:(par1) => void
    handleRollClick;
    rollDisabled: boolean;
}

interface IState {
}

class EmoticonsList extends React.Component<IProps, IState> {
    constructor(props:IProps) {
        super(props);
        this.handleEmoticonClick = this.handleEmoticonClick.bind(this);
    }

    handleEmoticonClick(emoticonText: string): void {
        this.props.handleEmoticonClick(emoticonText);
    }

    getEmoticonsImages() {
        const emoticons:any[] = [];
        Object.keys(emoticonsImages).forEach((key, i) => {
            let source = emoticonsImages[key].default;
            let text = Array.isArray(emoticonsText[i]) ? emoticonsText[i][0] : emoticonsText[i];
            emoticons[i] = <EmoticonImg source={source} text={text} key={text} handleClick={this.handleEmoticonClick}/>;
        });
        return emoticons;
    }

    render() {
        return (
            <div className="col-xs-10" id="emoticon-row">
                <div className="row">
                    <div className="emoticons-div" id="emoticons">
                            {this.getEmoticonsImages()}
                    </div>
                    <div id="roll"><Roll handleClick={this.props.handleRollClick} rollDisabled={this.props.rollDisabled}/></div>
                </div>
            </div>
        );
    };
}

export default EmoticonsList;