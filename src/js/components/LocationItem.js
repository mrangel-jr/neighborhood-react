import React from 'react';

const LocationItem = (props) => {
    /**
     * Render function of LocationItem
     */
    return (
        <li role="button"
            className="box"
            tabIndex="0" 
            onKeyPress={props.openInfoWindow.bind(this, props.data.marker)} 
            onClick={props.openInfoWindow.bind(this, props.data.marker)}
        >
            {props.data.longname}
        </li>
    );
}

export default LocationItem;