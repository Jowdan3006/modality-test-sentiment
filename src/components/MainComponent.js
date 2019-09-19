import React, {Component} from 'react';
import chat1 from '../testData.json'

class MainComponent extends Component {
    state = {
        response: null,
        responseFetched: false,
        chat: null
    }

    ChatSet = () => {
        let chatMessages = this.state.chat.documents.map((document , index)=>{
            let time = parseFloat(Math.round(document.score * 100) / 100).toFixed(2);
            console.log(time + " this is the end");
            return <div key={index}>
                        <ul>
                            {/* if you want the id or language of the post uncomment the document.id for the id and the document.language for the language if you need it. */}
                            {/* <li>{document.id}</li> */}
                            {/* <li>{document.language}</li> */}
                            <li>{parseFloat(Math.round(document.score * 100)).toFixed(2) + " %"}</li>
                            <li>{document.text}</li>
                        </ul>
                    </div>
        })
        return chatMessages
    }
    // display purpices only till code is returning the sentiment string

    Chat = () =>{
        let regex = /(<([^>]+)>)/ig;
        let chatMessages = chat1.value.map((textDataDetail )=>{
            return {
                        "id": textDataDetail.id,
                        "language" : "en",
                        "text": textDataDetail.body.content.replace(regex, '')
                    }
                   
        })
        let document = { "documents": chatMessages }
        return document
    }

    handleSubmit(chat){
        let responseDemo;
        fetch('https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.1/sentiment', {
            method: "POST",
            headers:{
                "Ocp-Apim-Subscription-Key": "28ee5326ee394d9d8525159edaa73b26",
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body:JSON.stringify(chat)
        })
        .then(Response => Response.json())
        .then(response => {
                // new empty array
                let resSub = {documents: []};
                // loop through response
                response.documents.forEach( 
                    document => {
                        this.state.chat.documents.forEach( 
                            chatDoc => {
                                // compare the current document array id to the state chat id in a loop
                                if(document.id === chatDoc.id) {
                                    // add key value pair for score to the empty array
                                    chatDoc.score = document.score;
                                    resSub.documents.push(chatDoc);
                                }
                            }
                        );
                    }
                );
                // setstate the current chat to the new array
                console.log("Data Fetched");
                this.setState({chat: resSub})
            } 
        );
    };

    componentDidMount() {
        console.log("Mount Start");
        let chat = this.Chat();
        this.handleSubmit(chat);
        this.setState({
            chat
        })
        console.log("Mount Finish");
    }

    
  render() {
    console.log("Render Start");
    console.log(this.state.chat);

    return (
        <div>
            {
                this.state.chat === null ? <div>
                                               <p>We are fetching details</p>
                                           </div> : 
                                           this.ChatSet()
            }
        </div>
    )
  }
}

export default MainComponent;