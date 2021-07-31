import React from 'react';
import classes from "../../../containers/Pipes/Pipes.module.css"

const PipeItem = props => {
    return (

        <span className={classes.partPipes}
              rotate={props.deg}
              onClick={(e) => {props.onPipeClick(e, props.id, props.deg); props.handleToUpdate(e)} }
        >
              {props.item[0]}
        </span>
    )
}
export default PipeItem