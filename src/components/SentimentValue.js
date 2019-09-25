import React from 'react';

const SentimentValue = (props) => {
let color = "SentimentUnset"

        switch (props.score) {
            case 0 > 25:
                color = "SentimentVeryBad"
                break;
            case 25 > 50:
                color = "SentimentBad"
                break;
            case 50 > 75:
                color = "SentimentGood"
                break;
            case 75 > 100:
                color = "SentimentTopNotch"
                break;
        
            default: color = "SentimentUnset"
                break;
        }
return <div className={color + " SentimentValue"}>{props.score}</div>
}


export default SentimentValue;
