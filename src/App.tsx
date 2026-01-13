import { useState, useEffect, type JSX } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css'
import {handleSetStoredValue, handleGetStoredValue, handleSetStoredCategory, handleGetStoredCategory}  from './storageHandles';

function App() {
  //order our questions for navigation and for managing state
  const stateOrder = ['home', 'q1', 'q2', 'q3', 'q4', 'q5', 'summary'];
  type PageState = typeof stateOrder[number];
  const [count, setCount] = useState(0);

  const [currentState, setCurrentState] = useState<PageState>('q1');
  //todo: refactor to array of objects for expenses and categories
  const [inputExpense, setInputExpense] = useState<number>(0);
  const [inputCategory, setInputCategory] = useState<string>("");
  const currentIndex = stateOrder.indexOf(currentState);
  const [expenseList, setExpenseList] = useState<Expense[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const handleNext = () =>{
   if(currentIndex < stateOrder.length - 1) {
    //store input value when moving to next question
    if(currentState === 'q1'){
      handleSetStoredValue('q1', inputExpense);
      //prefill expenselist with income entry
      if(expenseList.length === 0){
        setExpenseList((prev) => [...prev, {id: 'income', amount: inputExpense, category: 'Income'}]);
      }
      else{
        setExpenseList((prev) => prev.map(item => item.id === 'income' ? {...item, amount: inputExpense} : item));
      }
      console.log(`Stored q1: ${handleGetStoredCategory('q1')}` );

    }
    else if(currentState === 'q2'){
      handleSetStoredValue('q2', inputExpense);
      setExpenseList((prev) => [...prev, {id: 'rent', amount: inputExpense, category: 'Mortgage/Rent'}]);
    }
    else if(currentState === 'q3'){
      handleSetStoredValue('q3', inputExpense);
      setExpenseList((prev) => [...prev, {id: 'entertainment', amount: inputExpense, category: 'Entertainment'}]);
    }
    else if(currentState === 'q4'){
      handleSetStoredValue('q4', inputExpense);
      handleSetStoredValue('q5', 0); //reset q5 value for new input
      setExpenseList((prev) => [...prev, {id: 'car', amount: inputExpense, category: 'Car Payment'}]);
      setInputExpense(0);
   }
    else if(currentState === 'q5'){
      //not used currently, since we handle adding expenses with separate button
      /*
      setCount(count => count + 1);
      handleSetStoredCategory(`expenseCategory${count}`, inputCategory);
      setInputCategory("");
      handleSetStoredValue(`expenseAmount${count}`, inputExpense);
      */
    }
    //prefill next question with stored value
    setInputExpense(handleGetStoredValue(stateOrder[currentIndex + 1]));
    console.log(`currentCategory: ${inputCategory}, currentExpense: ${inputExpense}`);
    setCurrentState(stateOrder[currentIndex + 1]);
  }
  };

  interface Expense {
  id: string;
  amount: number | "";
  category: string;
}

  const handleSubmitExpense = () => {
      const newEntry: Expense = {
    id: crypto.randomUUID(), 
    amount: Number(inputExpense),
    category: inputCategory,
  };

  // Add the new object to your array
  setExpenseList((prev) => [...prev, newEntry]);
      setInputCategory("");
      setInputExpense(0);
    }

    //removes previous expense when going back
  const handleRemoveExpense = (id: string) => {
    setExpenseList((prev) => prev.filter((item) => item.id !== id));
    console.log(`Removed expense with id: ${id}`);
  }

  const handleClearAllStorage = () => {
    localStorage.clear();
    setCount(0);
    setInputExpense(0);
    setInputCategory("");
    setExpenseList([]);
  
  };

  const handlePrev = () => {
    if(currentIndex > 0){
      //if going back to income question, prefill with stored value
      if(currentState === 'q1'){
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

  // Helper function to group your expenseList by category
const chartData = expenseList.reduce((acc, current) => {
  const existing = acc.find(item => item.name === current.category);
  if (existing) {
    existing.value += Number(current.amount);
  } else {
    acc.push({ name: current.category, value: Number(current.amount) });
  }
  return acc;
}, [] as { name: string, value: number }[]);


  //todo test keyboard input handling for enter key to submit and move to next question
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
    <div id="header"><h1>Expense Tracker</h1></div>
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
      
      <div style={{display: 'flex', gap: '100px'}}>

      {currentState === 'q5' && (
        <div className="page">
          <h3 >Enter any other expenses:</h3>
          
          <p>Category: 
          <input 
            id='category-input'
            placeholder='Dining out, utilities, etc.'
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
            >
          </input>
          </p>
          <p id='amount-title'>Amount: 
          <input 
            //id='expense-input'
            value={inputExpense}
            onChange={(e) => {
              const val = Number(e.target.value);
              setInputExpense(isNaN(val) ? 0 : val);
            }}
            >
          </input>
          </p>
           <button onClick={handleSubmitExpense }>
            Add Expense
        </button>
      </div>

      )}

      {currentState === 'q5' && (
<div style = {{flex:1, marginLeft: '50px', marginRight: '-50px'}}>
        <h3>Current Expenses:</h3>
        <div className="display-list">
        {expenseList.map((item) => (
        <div key={item.id} className="expense-item">
          <strong>{item.category}:</strong> ${item.amount}
          <button onClick={() => {
            setExpenseList((prev) => prev.filter((i) => i.id !== item.id));
          }}
          >Remove</button>
        </div>
      ))}
      <button onClick={() => handleClearAllStorage()}>Clear All Expenses</button>
      </div>
        </div>
      )}

       
        <div style={{ flex: 1 , width: '500px', marginLeft: '-50px' }} id="chart-container">
    
      {currentState === 'q5' && (

    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%" // Center X
          cy="50%" // Center Y
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value" // Links to the 'amount'
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
      )}
  </div>
      </div>
      </div>
      
          <div className="nav-controls">
        
          <button 
          id='prev-button'
          onClick={() => {
            //todo remove expense associated with previous question when going back
            console.log(`Current State: ${currentState}`);
            console.log(`Removing expense for previous category: ${handleGetStoredCategory(currentState[currentIndex - 1])}`);
            handleRemoveExpense(handleGetStoredCategory(currentState[currentIndex - 1]));
            handlePrev();
          }} 
          disabled={currentState === 'home'} 
          hidden={currentState === 'home'}>
            Back
          </button>
          <button 
          id='next-button'
          onClick={handleNext}
          disabled={currentState === 'summary'} 
          hidden={currentState === 'summary'}>
            Next
          </button>
      </div>
      </>
  );
}
export default App
