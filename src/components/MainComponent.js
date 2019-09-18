import React, {Component} from 'react';
import chat1 from '../testData.json'

class MainComponent extends Component {     
    Chat = () =>{
        let regex = /(<([^>]+)>)/ig;
        let chatMessages = chat1.value.map((textDataDetail , index)=>{
            return <div key={index}>
                        {textDataDetail.body.content.replace(regex, '')}
                    </div>
        })
        return chatMessages
    }
    handleSubmit(){ 
        fetch('https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.1/sentiment', {
            method: 'post',
            // need to put into header
            // Host: westcentralus.api.cognitive.microsoft.com,
            // Ocp-Apim-Subscription-Key: 28ee5326ee394d9d8525159edaa73b26,
         body: {
          "content": this.Chat()
         }
        });
       }; 

  render() {
    return (
        <div>
            {/* {this.Chat()} */}
            {this.handleSubmit()}
        </div>
    )
  }
}

export default MainComponent;

// https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.1/sentiment