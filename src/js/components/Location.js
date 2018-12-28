import React from 'react';

const Location = (props) => {
    return (
        <li tabIndex="0" 
            onKeyPress={props.openInfoWindow.bind(this, props.data.marker)} 
            onClick={props.openInfoWindow.bind(this, props.data.marker)}
        >
            {props.data.name}
            <hr/>
        </li>
    );
}

export default Location;