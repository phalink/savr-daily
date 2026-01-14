import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css'
import {handleSetStoredValue, handleGetStoredValue, handleGetStoredCategory}  from './storageHandles';

function App() {
  //order our questions for navigation and for managing state
  const stateOrder = ['home', 'q1', 'q2', 'q3', 'q4', 'q5', 'summary'];
  type PageState = typeof stateOrder[number];

  //state variables
  const [currentState, setCurrentState] = useState<PageState>('q1');
  const [inputExpense, setInputExpense] = useState<number>(0);
  const [inputCategory, setInputCategory] = useState<string>("");
  const currentIndex = stateOrder.indexOf(currentState);
  const [expenseList, setExpenseList] = useState<Expense[]>([]);

  //colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

//initialize input value from storage when component mounts
  useEffect(() => {
    const storedValue = handleGetStoredValue(stateOrder[currentIndex]);
    setInputExpense(storedValue);
    console.log(`Initialized inputExpense with stored value: ${storedValue}`);
  }, []);

  const handleNext = () =>{
   if(currentIndex < stateOrder.length - 1) {
    //store current input value before navigating income first, then expenses as an object in array
    if(currentState === 'q1'){
      handleSetStoredValue('q1', inputExpense);
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
    //prefill next question with stored value
    setInputExpense(handleGetStoredValue(stateOrder[currentIndex + 1]));
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
    if(id === ''){
      console.log('no id provided');
     return;
    }
    setExpenseList((prev) => prev.filter((item) => item.id !== id));
    console.log(`Removed expense with id: ${id}`);
  }

  const handleClearAllStorage = () => {
    localStorage.clear();
    setInputExpense(0);
    setInputCategory("");
    setExpenseList([]);
    };

  const handleGetExpenseValue = (id: string): number => {
    const expense = expenseList.find(item => item.id === id);
    return expense ? Number(expense.amount) : 0;
  }

  const handlePrev = () => {
    if(currentIndex > 0){
      //if going back to income question, prefill with stored value
      if(currentState === 'q2'){
        setInputExpense(handleGetStoredValue('q1'));
      }
      else if(currentState === 'q3'){
        setInputExpense(handleGetExpenseValue('rent'));
        handleRemoveExpense('rent');
      }
      else if(currentState === 'q4'){
        setInputExpense(handleGetExpenseValue('entertainment'));
        handleRemoveExpense('entertainment');
      }
      else if(currentState === 'q5'){
        setInputExpense(handleGetExpenseValue('car'));
        console.log(`Prefilled inputExpense with stored value: ${handleGetExpenseValue('car')}`);
        handleRemoveExpense('car');
      }
      else if(currentState === 'summary'){
        setInputExpense(handleGetStoredValue('q5'));
        setInputCategory(handleGetStoredCategory('q5'));
      }
      //setInputExpense(handleGetExpenseValue(stateOrder[currentIndex - 1]));
      //console.log(`Prefilled inputExpense with stored value: ${handleGetExpenseValue(stateOrder[currentIndex - 1])}`);
      handleRemoveExpense(stateOrder[currentIndex - 1]);
      setCurrentState(stateOrder[currentIndex - 1]);
    }
  };

  // Helper function to group expenseList by category
const chartData = expenseList.reduce((acc, current) => {
  const existing = acc.find(item => item.name === current.category);
  if (existing) {
    existing.value += Number(current.amount);
  } else {
    acc.push({ name: current.category, value: Number(current.amount) });
  }
  return acc;
}, [] as { name: string, value: number }[]);

//keyboard event listener for enter key to navigate next or submit on expense page
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && currentState !== 'q5') {
        handleNext();
      }
      else if (event.key === 'Enter' && currentState === 'q5') {
        handleSubmitExpense();
      }
    };
    
  window.addEventListener('keydown', handleKeyDown);

  //cleanup to prevent multiple listeners
  return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputExpense, inputCategory, currentState]);
 
  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0); 
  const monthlySavings = handleGetStoredValue('q1') - totalExpenses;
  console.log('testing stored value', handleGetStoredValue('q1'));

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

       <div style={{ flex: 1 , width: '850px' }} id="chart-container">
    
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

      {currentState === 'q5' && (
<div style = {{flex:1, marginLeft: '50px', marginRight: '-50px'}}>
        <h3>Current Expenses:</h3>
        <div className="display-list">
        {expenseList.map((item) => (
        <div key={item.id} className="expense-item">
          <strong>{item.category}:</strong> ${item.amount}
          <button onClick={() => {
            handleRemoveExpense(item.id);
          }}
          >Remove</button>
        </div>
      ))}
      <button onClick={() => handleClearAllStorage()}>Clear All Expenses</button>
      </div>
        </div>
      )}
       
       
      </div>
      </div>
      
          <div className="nav-controls">
        
          <button 
          id='prev-button'
          onClick={() => {
            //todo remove expense associated with previous question when going back
            console.log(`Current State: ${currentState}`);
            handlePrev();
          }} 
          disabled={currentState === 'home'} 
          hidden={currentState === 'home'}>
            Back
          </button>
          <button 
          id='next-button'
          onClick={handleNext}
          disabled={currentState === 'q5'} 
          hidden={currentState === 'q5'}>
            Next
          </button>
      </div>
      <div>
        <p>Monthly Savings: ${monthlySavings}</p>
      </div>
      </>
  );
}
export default App
