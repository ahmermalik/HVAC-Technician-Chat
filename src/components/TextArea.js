import React from 'react';
import PropTypes from 'prop-types';

const TextArea = (props) => (
    <div className="form-group">
    <label 
        className= {props.labelClassName + ' form-label'} 
        
    >
        {props.title}
    </label>
    <br></br>
    <textarea
            className={props.className}
            style={props.resize ? null : {resize: 'none'}}
            name={props.name}
            rows={props.rows}
            value={props.content}
            onChange={props.controlFunc}
            placeholder={props.placeholder} />
    </div>
);

TextArea.propTypes ={
    title: PropTypes.string.isRequired,
    labelClassName: PropTypes.string,
    rows: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    resize: PropTypes.bool,
    placeholder: PropTypes.string,
    controlFunc: PropTypes.func.isRequired
};

export default TextArea;
