import React from 'react';
import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' }
]

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        {
            controls.map((val) => (
                <BuildControl 
                key={val.label} 
                label={val.label}
                count = {props.ingredients[val.type]}
                added={()=>props.ingredientsAdded(val.type)}
                removed={()=>props.ingredientsRemoved(val.type)}
                // disabled={props.disabled[val.type]}
                />
        ))}
    </div>
);

export default buildControls;

