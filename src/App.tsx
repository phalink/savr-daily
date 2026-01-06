import { useState, useEffect } from 'react'
import './App.css'
import {handleSetStoredValue, handleGetStoredValue, handleSetStoredCategory, handleGetStoredCategory, handleRemoveStoredValue } from './storageHandles';

function App() {
  //order our questions for navigation and for managing state
  const stateOrder = ['home', 'q1', 'q2', 'q3', 'q4', 'q5', 'summary'];
  type PageState = typeof stateOrder[number];
  const [count, setCount] = useState(0);

  const [currentState, setCurrentState] = useState<PageState>('q4');
  //todo: refactor to array of objects for expenses and categories
  const [inputExpense, setInputExpense] = useState<number>(0);
  const [inputCategory, setInputCategory] = useState<string>("");
  const currentIndex = stateOrder.indexOf(currentState);

  const handleNext = () =>{
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
      handleSetStoredValue('q5', 0); //reset q5 value for new input
      console.log('handlegetstoredvalue q5:', handleGetStoredValue('q5'));
      setInputCategory("");
      console.log("Submitting q4 input");
      console.log(`Submit input for ${currentState}:`, inputExpense);
      setInputExpense(0);
      console.log("Submit count: ", count);
   }
    else if(currentState === 'q5'){
      //store input value
      //pull existing count from storage
      //handleGetStoredValue(`${count}`);
      //handleSetStoredValue('q5', inputExpense);
      setCount(count => count + 1);
      handleSetStoredCategory(`expenseCategory${count}`, inputCategory);
      setInputCategory("");
      handleSetStoredValue(`expenseAmount${count}`, inputExpense);
      //handleSetStoredValue(`${count}`, count);
    }
    setCurrentState(stateOrder[currentIndex + 1]);
    setInputExpense(handleGetStoredValue(stateOrder[currentIndex + 1]));
  }
  };

  const handlePrev = () => {
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
      else if(currentState === 'summary'){
        setInputExpense(handleGetStoredValue('q5'));
        setInputCategory(handleGetStoredCategory('q5'));
      }
      setCurrentState(stateOrder[currentIndex - 1]);
    }
  };

  const handleSubmitExpense = () => {
    setCount(count + 1);
    handleSetStoredCategory(`expenseCategory${count}`, inputCategory);
    setInputCategory("");
    <div><p>'testing'</p></div>
    handleSetStoredValue(`expenseAmount${count}`, inputExpense);
    setInputExpense(handleGetStoredValue(stateOrder[currentIndex]));
  }
    //todo include all values AND categories
  const handleGetAllCountValuesCategories = (count: number): string => {
    let valuesList = "";
    for (let i = 1; i <= count; i++) {
      const valueKey = `expenseAmount${i}`;
      const categoryKey = `expenseCategory${i}`;
      const value = localStorage.getItem(valueKey);
      const category = localStorage.getItem(categoryKey);
      if (value) {
        valuesList += `Expense ${i}: ${value}`;
        if (category) {
          valuesList += ` (${category})`;
        }
        valuesList += "\n";
      }
    }
    return valuesList;
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
        if (inputExpense === 0 && inputCategory === '') {
          //process input before clearing
          console.log(`Submit input for ${currentState}:`, inputExpense);
          handleSetStoredValue('q5', inputExpense);
          setInputCategory("");
          setCurrentState('summary');
          setInputExpense(handleGetStoredValue('summary'));
        } else {
          console.log('test failed');
        }
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
          disabled={currentState === 'summary'} 
          hidden={currentState === 'summary'}>
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

      {currentState === 'q5' && (
      <div className="confirmation-box">
        <button onClick={handleSubmitExpense }>
            Add Another Expense
        </button>
        <h3>Nice, your extra expenses so far: </h3>
        <p>{handleGetAllCountValuesCategories(count)}</p>
        <button onClick={handleRemoveStoredValue(`expenseAmount${count - 1}`)}>Remove Last Expense</button>
      </div>
      )}

      {(currentState === 'q2' || currentState === 'q3' || currentState === 'q4' ) &&( 
      <div className="confirmation-box">
        <h3>Nice, your previous submission: </h3>
        <p>{handleGetStoredValue(stateOrder[currentIndex - 1])}</p>
      </div>
      )}
      </div>
      </>
  );
}
export default App
