// import React, { useState, useEffect } from 'react'; // Import React
// import './index.css';

// function App() {
//   const [value, setValue] = useState(null);
//   const [message, setMessage] = useState(null);
//   const [previousC, setPreviousC] = useState([]);
//   const [currtitile, setCurrTitle] = useState(null);
  
//   const createnewChat = () => {
//     setMessage(null);
//     setValue('');
//     setCurrTitle(null);
//   }
  
  
//   const getMessages = async () => {
//     const options = {
//       method: 'POST',
//       body: JSON.stringify({
//         message: value,
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     };

//     try {

//       const response = await fetch('http://localhost:8000/completions', options);
      
//         const data = await response.json();
//         console.log(data);
//         setMessage(data.choices[0].message)
      
      
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   console.log(value);
//   console.log(message);

//   useEffect(() => {

//     if (!currtitile && value && message) {
//       setCurrTitle(value)
//     }

//     if (currtitile && value && message) {
//       setPreviousC(previousC => (
//         [...previousC,
//         {
//                 title : currtitile,
//                 role: 'user',
//                 content: value
//         },
//         {
//           title: currtitile,
//           role: message.role,
//           content: message.content
//         }

//         ]
//       )) 

//     }
//   }, [message, currtitile])
   
//   console.log(previousC);
//   return (
//     <div className='app'>
//       <section className="side-bar">
//         <button onClick ={createnewChat}>New chat</button>
//         <ul className='history'>
//           <li>BLUGH</li>
//         </ul>
//         <nav className="nav">
//           <p>Made by Bharath</p>
//         </nav>
//       </section>

//       <section className="mainC">
//        {!currtitile &&  <h1> Bharath GPT</h1>}
//         <ul className='feed'>

//         </ul>
//         <div className="bottom-section">
//           <div className="input-container">
//             <input value={value} onChange={(e) => setValue(e.target.value)} />
//             <div id='submit' onClick={getMessages}>➢</div>
//           </div>
//         </div>
//         <p className="info">Chat GPT  new version</p>
//       </section>
//     </div>
//   );
// }

// export default App;















import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState(null);
  const [previousC, setPreviousC] = useState([]);
  const [currtitile, setCurrTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue('');
    setCurrTitle(null);
  }

  const handleClick = (uniqueTitle) => {
    setCurrTitle(uniqueTitle);
    setMessage(null);
    setValue('');
  }
  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      console.log("inside try")
      const response = await fetch('http://localhost:8000/completions', options);
      if (response.ok) {
        const data = await response.json();
        setMessage(data.choices[0]);
      } else {
        console.error('Request failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (currtitile && value && message) {
      setPreviousC((previousC) => ([
        ...previousC,
        {
          title: currtitile,
          role: 'user',
          content: value,
        },
        {
          title: currtitile,
          role: 'bot', // You can specify a default role like 'bot' here.
          content: message.content,
        },
      ]));
    }
  }, [message, currtitile, value]);


  const currentChat = previousC.filter(previousC => previousC.title === currtitile);
 const uniqueTitle = Array.from(new Set(previousC.map(previousC => previousC.title)));
console.log(uniqueTitle);
  return (
    <div className='app'>
      <section className="side-bar">
        <button onClick={createNewChat}> New chat</button>
        <ul className='history'>
         {uniqueTitle.map((uniquetitle , index) => {
          <li key ={index} onClick={() =>handleClick(uniquetitle)}>{uniquetitle}</li>
         })} 
        </ul>
        <nav className="nav">
          <p>Made by Bharath</p>
        </nav>
      </section>

      <section className="mainC">
        {!currtitile && <h1> Bharath GPT</h1>}
        <ul className='feed'>
          {currentChat.map((item, index) => (
            <li key={index} >
              {/* <strong>{item.title}:</strong> {item.content} */}
              <p className='role'>{item.role}</p>
              <p>{item.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  getMessages();
                }
              }}
            />
            <div id='submit' onClick={getMessages}>➢</div>
          </div>
        </div>
        <p className="info">Chat GPT new version</p>
      </section>
    </div>
  );
}

export default App;
