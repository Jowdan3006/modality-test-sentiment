import React, { Component } from 'react';
import SentimentValue from './SentimentValue';

class Channel extends Component {
//   state = {
//     response: null,
//     responseFetched: false,
//     chat: null
//   }

//   ChatSet = () => {
//     let chatMessages = this.state.chat.documents.map((document, index) => {
//       let time = parseFloat(Math.round(document.score * 100) / 100).toFixed(2);
//       console.log(time + " this is the end");
//       return (
//         <div key={index}>
//           <ul>
//             {/* if you want the id or language of the post uncomment the document.id for the id and the document.language for the language if you need it. */}
//             {/* <li>{document.id}</li> */}
//             {/* <li>{document.language}</li> */}
//             <li>{<SentimentValue score={parseFloat(Math.round(document.score * 100)).toFixed(2)} />}</li>
//             <li>{document.text}</li>
//           </ul>
//         </div>
//       )
//     })
//     return chatMessages
//   }
//   // display purpices only till code is returning the sentiment string

  

  

//   componentDidMount() {
    
//     if (this.props.channelMessages) {
//     console.log("Mount Start");
//     let chat = this.Chat();
//     this.handleSubmit(chat);
//     this.setState({
//       chat
//     })
//     console.log("Mount Finish");
//     }
//   }


//   render() {
//     console.log("Render Start");
//     console.log(this.state.chat);

//     return (
//       <div>
//         {
//           this.state.chat === null ?
//             <div> <p>We are fetching details</p> </div> :
//             this.ChatSet()
//         }
//       </div>
//     )
//   }
  componentDidMount() {
  }
  render() {
    return (
      <div></div>
    )
  }
}

export default Channel;
