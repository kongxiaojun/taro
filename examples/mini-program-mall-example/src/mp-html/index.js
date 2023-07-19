'use strict'
import React from 'react'
import parse, {attributesToProps} from 'html-react-parser';

class _C extends React.Component {
    render() {
        const {content} = this.props
        return content ? <div style={{width: '100%', overflow: "visible"}}>{parse(content, {
            replace: domNode => {
                if (domNode.attribs && domNode.name === 'img') {
                    const props = attributesToProps(domNode.attribs);
                    return <img style={{width: '100vw'}} {...props} />;
            }

        }
        })}</div> : ''
    }
}

export default _C
