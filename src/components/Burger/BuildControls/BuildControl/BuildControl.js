import React from 'react';
import classes from './BuildControl.css';

const buildControl = (props) =>(
    <div className={classes.BuildControl}>
        <div className={classes.Label}>{props.label}</div>
        <button className={classes.Less} onClick={props.removed} disabled={props.disabled}>-</button>
        <span className={classes.countArea}> {props.count}</span>
        <button className={classes.More} onClick={props.added}>+</button>
    </div>
);

export default buildControl;