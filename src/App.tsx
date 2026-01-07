import { useState, useEffect } from 'react'
import './App.css'
import {handleSetStoredValue, handleGetStoredValue, handleSetStoredCategory, handleGetStoredCategory, handleRemoveStoredValue, handleRemoveStoredCategory} from './storageHandles';

function App() {
  //order our questions for navigation and for managing state
  const stateOrder = ['home', 'q1', 'q2', 'q3', 'q4', 'q5', 'summary'];
  type PageState = typeof stateOrder[number];
  const [count, setCount] = useState(0);

  const [currentState, setCurrentState] = useState<PageState>('q5');
  //todo: refactor to array of objects for expenses and categories
  const [inputExpense, setInputExpense] = useState<number>(0);
  const [inputCategory, setInputCategory] = useState<string>("");
  const currentIndex = stateOrder.indexOf(currentState);
  const [inputExpenseArray, setInputExpenseArray] = useState<{amount: number, category: string}[]>([]);

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
    if(localStorage.getItem(`expenseAmount${count}`) === null && inputExpense === 0 && inputCategory === ""){
      return; //do not submit empty expense
    }
    if(localStorage.getItem(`expenseAmount${count}`) !== null){
      setCount((localStorage.length / 2) + 1); //each expense has a category, so divide by 2
      console.log("Existing expense found, updating count to: ", count);
    }
    else{
      setCount(count =>count + 1);
      console.log("Updated count to: ", count);
    }
      handleSetStoredCategory(`expenseCategory${count}`, inputCategory);
      setInputCategory("");
      handleSetStoredValue(`expenseAmount${count}`, inputExpense);
      setInputExpense(handleGetStoredValue(stateOrder[currentIndex]));
      
    }

  const handleClearAllStorage = () => {
    localStorage.clear();
    setCount(0);
    setInputExpense(0);
    setInputCategory("");
    setCurrentState(prev => prev = 'q5');
  };

  const renderExpenses = () => {
    const expenses = [];
    for(let i = 0; i < count; i++){
      const amount = handleGetStoredValue(`expenseAmount${i}`);
      const category = handleGetStoredCategory(`expenseCategory${i}`);
      expenses.push(
        <div key={i}>
          <p>Expense {i + 1}: ${amount} - {category}</p>
          <button onClick={() => editLocalStorageExpense(`expenseAmount${i}`, `expenseCategory${i}`, amount, category)}>Edit</button>
        </div>
      );
    }
    return expenses;
  };

  //todo implement edit expense function
  const editLocalStorageExpense = (keyAmount: string, keyCategory: string, newAmount: number, newCategory: string) => {
    handleSetStoredValue(keyAmount, newAmount);
    handleSetStoredCategory(keyCategory, newCategory);
  }

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
          <h2>Almost done!</h2> 
          <h3 id="other-expenses">Enter any other expenses:</h3>
          <p id='amount-title'>amount:
          <input 
            //id='expense-input'
            value={inputExpense}
            onChange={(e) => {
              const val = e.target.value;
              setInputExpense(val === "" ? 0 : Number(val));
            }}
            >
          </input>
          </p>
          <p>category:
          <input 
            id='category-input'
            placeholder='dining out, utilities, etc.'
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
            >
          </input>
          </p>
          </div>
      )}
    
      {currentState === 'q5' && (
      <div className="confirmation-box">
        <button onClick={handleSubmitExpense }>
            Add Another Expense
        </button>
        <button onClick={() => renderExpenses()}>View Expenses</button>
        <button onClick={() => handleRemoveStoredValue(`expenseAmount${count}`)}>Remove Last Expense</button>
        <button onClick={() => handleClearAllStorage()}>Clear All Expenses</button>
      </div>
      )}

      {(currentState === 'q2' || currentState === 'q3' || currentState === 'q4' ) &&( 
      <div className="confirmation-box">
        <h3>Nice, your previous submission: </h3>
        <p>{handleGetStoredValue(stateOrder[currentIndex - 1])}</p>
      </div>
      )}
      </div>

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
      </>
  );
}
export default App
