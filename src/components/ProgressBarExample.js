import React from "react";
import MainComponent from './MainComponent'
import { directive } from "@babel/types";

class ProgressBarExample extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            percentage: 60
        }
    }

    render(){
        return (
            <div>
                <ProgressBar percentage={this.state.percentage} />
            </div>
        )
    }
}