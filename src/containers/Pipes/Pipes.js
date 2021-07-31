import React from 'react';
import classes from "./Pipes.module.css"
import Pipe from "../../components/Pipe/Pipe"

const WSserver = new WebSocket('wss://hometask.eg1236.com/game-pipes/');
let classLvlGame;

class PipesPage extends React.Component {
    constructor() {
        super();
        this.state = {
            initGame: 0,
            pipes: [],
            countLine: 0,
            level: 0,
            score: 0,
        };
        this.onClickPartPipesHandler = this.onClickPartPipesHandler.bind(this);
    }


    messageGetServer() {
        WSserver.onmessage = (event) => {

            switch (event.data.replace(/[\n\r]/g, '').split("")[0]) {
                case 'h':
                    return console.log(event.data);
                case 'n':
                    return console.log(event.data);
                case 'm':
                    return this.initMap(event.data);
                case 'r':
                    return console.log(event.data);
                case 'v':
                    return alert(event.data);
                default:
                    return console.log('Unknown command');
            }

        }
    }

    componentDidMount() {
        this.messageGetServer();
    }

    initMap = (arr) => {

        if (arr === "map: Not started") {
            return
        }

        let arrMap = [],
            arrGet = arr.split(/\n/g),
            countLine = 0,
            positionX = 0,
            positionY = 0,
            rotate = 0,
            id = -1;

        arrGet.forEach(function (item, index) {
            const indexZero = index - 1;

            if (item !== 'map:' && item !== '') {
                ++countLine

                for (let i = 0; i < item.length; i++) {
                    positionX = i
                    positionY = indexZero
                    id++

                    arrMap.push(
                        [
                            item[i],
                            positionX,
                            positionY,
                            rotate,
                            countLine,
                            id
                        ]
                    )

                }
            }
        });
        this.setState((state) => {
            return ({
                pipes: state.pipes.concat(arrMap),
                countLine: state.countLine = countLine
            })
        }, function () {
            // console.log(this.state);
        });
    }

    onClickPartPipesHandler = (e, id, deg) => {
        this.setState( {score: this.state.score + 1})
        const pipePosition = [this.state.pipes[id][1], this.state.pipes[id][2]]
        let rotation = deg;

        rotation === 270 ? rotation = 0 : rotation += 90;

        WSserver.send(`rotate ${pipePosition.join(' ')}`)

        this.setState((props) => {
            props.pipes[id][3] = rotation
        })
    }

    onChangeLevelHandle = (e) => {
        if (this.state.score !== 0) {
            if (window.confirm("Are you sure you want to complete the current progress?")) {
                this.setState({initGame: 0, level: e.target.value, score: 0,  pipes: [] })
            } else {
                return false;
            }
        } else {
            this.setState({initGame: 0, level: e.target.value})
        }

    }

    onInitGameHandle = (e) => {
        this.setState( { pipes: [], initGame: 1}, function () {
            WSserver.send(`new ${this.state.level}`)
            WSserver.send(`map`)
            classLvlGame =   this.state.level === '1' ? classes.level1 :
                             this.state.level === '2' ? classes.level2 :
                             this.state.level === '3' ? classes.level3 : classes.level4
        })
    }

    onVerifyGameHandle = (e) => {
        if (this.state.initGame === 1) {
            WSserver.send(`verify`)
        }
    }

    handleToUpdate = () => {
        this.forceUpdate()
    }

    chunkLine = (arr, len) => {
        var chunks = [],
            i = 0,
            n = arr.length;
        while (i < n) {
            chunks.push(arr.slice(i, i += len));
        }
        return chunks;
    }

    render() {

        return (
            <div className={classes.pipesB}>

                <div className={classes.pipesControlB}>
                    <div className={classes.pipesControlLvl}>
                        <span>Level Game: </span> <select name="levelGame" value={this.state.level}
                                                          onChange={this.onChangeLevelHandle}>
                        <option value="0" disabled>?</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                    </div>
                    <div className={classes.pipesControlScore}>
                        Score: <span>{this.state.score}</span>
                    </div>
                    <div className={classes.pipesControlHelp}>
                        <span>?</span>
                    </div>
                </div>
                <div className={classes.pipesContainerView}>
                    <div className={`${classes.pipesCanvasB} ${classLvlGame}`}>
                        {this.chunkLine(this.state.pipes, this.state.countLine).map((pipesGroup, index) => {
                            return (
                                <Pipe
                                    key={index}
                                    pipesLine={this.state.countLine}
                                    pipes={pipesGroup}
                                    handleToUpdate={this.handleToUpdate}
                                    onPipeClick={this.onClickPartPipesHandler}
                                />
                            )
                        })}
                    </div>
                </div>
                <div className={classes.pipesControlB}>
                    {this.state.level !== 0 && this.state.initGame === 0 &&
                    <button className={classes.pipesStartGame} onClick={this.onInitGameHandle}>Start Game</button>
                    } {this.state.initGame === 1 && this.state.score !== 0 &&
                <button className={classes.pipesVerifyGame} onClick={this.onVerifyGameHandle}>Verify Game</button>
                }
                </div>
            </div>

        )
    }
}

export default PipesPage