import { useState } from 'react'
import { useEffect} from 'react'
import './App.css'

function App() {
  const stateOrder = ['home', 'q1', 'q2', 'q3', 'q4', 'q5'];
  type PageState = typeof stateOrder[number];

  const [currentState, setCurrentState] = useState<PageState>('q1');
  const [inputExpense, setInputExpense] = useState<number>(0);
  const [inputCategory, setInputCategory] = useState<string>("");
  const nextButton = document.getElementById('next-button');
  const prevButton = document.getElementById('prev-button');

  const handleNext = () =>{
   const currentIndex = stateOrder.indexOf(currentState);
   if(currentIndex < stateOrder.length - 1) {
    setCurrentState(stateOrder[currentIndex + 1]);
   }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && currentState === 'q1') {
        setCurrentState('q2')
      }
      else if (event.key === 'Enter' && currentState === 'q2') {
        setCurrentState('q3');
      }
      else if (event.key === 'Enter' && currentState === 'q3') {
        setCurrentState('q4');
      }
      else if (event.key === 'Enter' && currentState === 'q4') {
        setCurrentState('q5');
      }
      else if (event.key === 'Enter' && currentState === 'q5') {
        //process input before clearing
        console.log(`Submit input for ${currentState}:`, inputExpense);
        setInputExpense(0);
        setInputCategory("");
        setCurrentState('q5');
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
          <input placeholder='0'></input>
          </div>
      )}

      {currentState === 'q2' && (
        <div className="page">
          <h2>What is your monthly mortgage/rent payment?</h2>
          <input placeholder='0'></input>
          </div>
      )}

      {currentState === 'q3' && (
        <div className="page">
          <h2>What is your monthly entertainment bill(Netflix, Hulu, HBO, etc.)?</h2>
          <input placeholder='0'></input>
          </div>
      )}

      {currentState === 'q4' && (
        <div className="page">
          <h2>What is your monthly car payment?</h2>
          <input placeholder='0'></input>
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
          onClick={handleNext} disabled={currentState === 'q5'}>
            Next
          </button>
      </div>

      </div>
      </>
  );
}
export default App
