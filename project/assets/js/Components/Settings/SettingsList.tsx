import React from 'react';
import Status from "../Status/Status";

interface IProps {
    settings: {
        sound: boolean,
        scroll: boolean,
    },
    status: string,
    handleChangeSound: () => void,
    handleChangeScroll: () => void,
}

class SettingsList extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div className="col-xs-2" id="settings">
                <div className="row">
                    <Status status={this.props.status} />
                    <div className={"pointer sound " + (this.props.settings.sound ? "audio-on" : "audio-off")} onClick={this.props.handleChangeSound}/>
                    <div className={"pointer scroll " + (this.props.settings.scroll ? "scroll" : "no-scroll")} onClick={this.props.handleChangeScroll}/>
                </div>
            </div>
        );
    }
}

export default SettingsList;