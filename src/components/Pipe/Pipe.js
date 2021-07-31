import React from 'react';
import PipeItem from "./PipeItem/PipeItem";
import classes from "../../containers/Pipes/Pipes.module.css"

const Pipe = (props) => {
    // function* chunks(arr, n) {
    //     for (let i = 0; i < arr.length; i += n) {
    //         yield arr.slice(i, i + n);
    //     }
    // }
    return (
        <div className={classes.pipesLine}>
            {props.pipes.map((pipes, index) => {
                return (
                    <PipeItem
                        key={index}
                        x={pipes[1]}
                        y={pipes[2]}
                        deg={pipes[3]}
                        id={pipes[5]}
                        item={pipes}
                        handleToUpdate={props.handleToUpdate}
                        onPipeClick={props.onPipeClick}
                    />
                )
            })}
        </div>
    )
}

export default Pipe