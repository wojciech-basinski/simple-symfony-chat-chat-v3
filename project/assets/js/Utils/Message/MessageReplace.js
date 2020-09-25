import React from "react";

export default function replace(attribs) {
    if (attribs && attribs.class === 'bbcode-img pointer') {
        return <img src={attribs.src}
                    onClick={((e) => {openBBImgInNewWindow(e)})} className={attribs.class} />
    }
}

function openBBImgInNewWindow(e) {
    window.open(e.target.src, '_blank');
}