import React, {Component} from 'react';
import chat1 from '../testData.json'

class MainComponent extends Component { 

    // Chat = () =>{
    //     let regex = /(<([^>]+)>)/ig;
    //     let chatMessages = chat1.value.map((textDataDetail , index)=>{
    //         return <div key={index}>
    //                     {textDataDetail.body.content.replace(regex, '')}
    //                 </div>
    //     })
    //     return chatMessages
    // }

    Chat = () =>{
        let regex = /(<([^>]+)>)/ig;
        let chatMessages = chat1.value.map((textDataDetail , index)=>{
            return {
                    "language": "en",
                    "id": index,
                    "text": textDataDetail.body.content.replace(regex, '')
                    }
                    // has to be in the order id language, id then text if not in this order then api wont work.
                   
        })
        return chatMessages
    }
    // ChatTitle = () =>{
    //     let regex = /(<([^>]+)>)/ig;
    //     let chat = chat1.value.map((wholeBody , index)=>{
    //         return <span key={index}>
    //                     {wholeBody}
    //                 </span>
    //     })
    //     return chat
    // }

    handleSubmit(){
        let responseDemo = {"documents": this.Chat()}; 
        fetch('https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.1/sentiment', {
            method: "POST",
            headers:{
                "Ocp-Apim-Subscription-Key": "28ee5326ee394d9d8525159edaa73b26",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: this.Chat(),
        }).then(Response => Response.json())
          .then(responseData =>  responseDemo);
       }; 
       /*
        returning bad object as this is sending [object Object] and if you look into the [object Object]
        it displays the data as 
        id
        language
        text
        i need to it send as one item and not many object arrays. 
       */

  render() {
      console.log(this.handleSubmit());
      console.log(this.Chat());
    return (
        <div>
            {/* {this.Chat()} */}
            {/* {this.handleSubmit()} */}
        </div>
    )
  }
}

export default MainComponent;