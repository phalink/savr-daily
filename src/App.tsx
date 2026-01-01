import { useState, useEffect } from 'react'
import './App.css'

function App() {
  //order our questions for navigation and for managing state
  const stateOrder = ['home', 'q1', 'q2', 'q3', 'q4', 'q5'];
  type PageState = typeof stateOrder[number];

  const [currentState, setCurrentState] = useState<PageState>('q1');
  const [inputExpense, setInputExpense] = useState<number>(0);
  const [inputCategory, setInputCategory] = useState<string>("");

  const handleNext = () =>{
   const currentIndex = stateOrder.indexOf(currentState);
   if(currentIndex < stateOrder.length - 1) {
    //store input value when moving to next question
    if(currentState === 'q1'){
      handleSetStoredValue('q1', inputExpense);
    }
    else if(currentState === 'q2'){
      handleSetStoredValue('q2', inputExpense);
    }
    else if(currentState === 'q3'){
      handleSetStoredValue('q3', inputExpense);
    }
    else if(currentState === 'q4'){
      handleSetStoredValue('q4', inputExpense);
      setInputCategory("");
   }
    setCurrentState(stateOrder[currentIndex + 1]);
    setInputExpense(handleGetStoredValue(stateOrder[currentIndex + 1]));
  }
  };

  const handleSetStoredValue = (key: string, value: number) => {
    localStorage.setItem(key, value.toString());
  }

  const handleGetStoredValue = (key: string): number => {
    const storedValue = localStorage.getItem(key);
    if(!storedValue) return 0;
    return storedValue ? Number(storedValue) : 0;
  }

  const handlePrev = () => {
    const currentIndex = stateOrder.indexOf(currentState);
    if(currentIndex > 0){
      //if going back to income question, prefill with stored value
      if(currentState === 'q1'){
        console.log("At beginning, no previous question");
      }
      else if(currentState === 'q2'){
        setInputExpense(handleGetStoredValue('q1'));
      }
      else if(currentState === 'q3'){
        setInputExpense(handleGetStoredValue('q2'));
      }
      else if(currentState === 'q4'){
        setInputExpense(handleGetStoredValue('q3'));
      }
      else if(currentState === 'q5'){
        setInputExpense(handleGetStoredValue('q4'));
      }
      setCurrentState(stateOrder[currentIndex - 1]);
    }
  };

  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && currentState === 'q1') {
        handleSetStoredValue('q1', inputExpense);
        setCurrentState('q2')
        setInputExpense(handleGetStoredValue('q2'));
      }
      else if (event.key === 'Enter' && currentState === 'q2') {
        handleSetStoredValue('q2', inputExpense);
        setInputExpense(0);
        setCurrentState('q3');
        setInputExpense(handleGetStoredValue('q3'));
      }
      else if (event.key === 'Enter' && currentState === 'q3') {
        handleSetStoredValue('q3', inputExpense);
        setCurrentState('q4');
        setInputExpense(handleGetStoredValue('q4'));
      }
      else if (event.key === 'Enter' && currentState === 'q4') {
        handleSetStoredValue('q4', inputExpense);
        setCurrentState('q5');
        setInputExpense(handleGetStoredValue('q5'));
      }
      else if (event.key === 'Enter' && currentState === 'q5') {
        //process input before clearing
        console.log(`Submit input for ${currentState}:`, inputExpense);
        handleSetStoredValue('q5', inputExpense);
        setInputCategory("");
        setCurrentState('q5');
        setInputExpense(handleGetStoredValue('q5'));
      }
    };

  window.addEventListener('keydown', handleKeyDown);

  //cleanup to prevent multiple listeners
  return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputExpense, inputCategory, currentState]);
  
  return (
    <>
     <div>
      {currentState === 'q1' && (
        <div className="page">
          <h2>What is your monthly income?</h2>
          <input 
            value = {inputExpense}
            onChange = {(e) => {
              const val = e.target.value;
              setInputExpense(val === "" ? 0 : Number(val));
            }
          }
            >
            </input>
          </div>
      )}

      {currentState === 'q2' && (
        <div className="page">
          <h2>What is your monthly mortgage/rent payment?</h2>
          <input 
          value={inputExpense}
          onChange={(e) => {
            const val = e.target.value;
            setInputExpense(val === "" ? 0 : Number(val));
          }}
          ></input>
          </div>
      )}

      {currentState === 'q3' && (
        <div className="page">
          <h2>What is your monthly entertainment bill(Netflix, Hulu, HBO, etc.)?</h2>
          <input 
          value={inputExpense}
          onChange={(e) => {
            const val = e.target.value;
            setInputExpense(val === "" ? 0 : Number(val));
          }}
          ></input>
          </div>
      )}

      {currentState === 'q4' && (
        <div className="page">
          <h2>What is your monthly car payment?</h2>
          <input 
          value={inputExpense}
          onChange={(e) => {
            const val = e.target.value;
            setInputExpense(val === "" ? 0 : Number(val));
          }}
          ></input>
          </div>
      )}
      
      {currentState === 'q5' && (
        <div className="page">
          <h2>Almost done! Enter any other expenses:</h2>
          <input 
            value={inputExpense}
            onChange={(e) => {
              const val = e.target.value;
              setInputExpense(val === "" ? 0 : Number(val));
            }}
            >
          </input>
          <h3>category:</h3>
          <input 
            placeholder='dining out, utilities, etc.'
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
            >
          </input>
          </div>
      )}
        <div className="nav-controls">
        <button 
          id='next-button'
          onClick={handleNext} 
          disabled={currentState === 'q5'} 
          hidden={currentState === 'q5'}>
            Next
          </button>
          <button 
          id='prev-button'
          onClick={handlePrev} 
          disabled={currentState === 'home'} 
          hidden={currentState === 'home'}>
            Back
          </button>
      </div>

      </div>
      </>
  );
}
export default App
