import "./Calculator.css";
import React from "react";
import {useState, useEffect} from "react";

function Calculator () {
    const [userInput, setUserInput] = useState("");
    const [alertMessage, setAlertMessage] = useState(null);
    const [numbersArray, setNumbersArray] = useState([]);
    const [operationsArray, setOperationsArray] = useState([]);
    const [result, setResult] = useState(null);

    const numberRegex = new RegExp("^-?\\d*[\\.]?\\d+$");
    const arithmeticRegex = new RegExp("^[\\+\\-\\*\\/]$");

    const clearInput = () => {
        setUserInput("");
        setResult(null);
        setAlertMessage(null);
        setNumbersArray([]);
        setOperationsArray([]);
    }

    useEffect(() => {
        separateArrays(splitString(userInput));
    }, [userInput]);

    const calculatorCompute = (expr) => {
        let stack = [];
        if (validateInput()) {
            expr.split(",").forEach((e) => {
            if (e === "+") {
              stack.push(stack.pop() + stack.pop());
            } else if (e === "-") {
              stack.push(stack.pop() - stack.pop());
            } else if (e === "*") {
              stack.push(stack.pop() * stack.pop());
            } else if (e === "/") {
              stack.push(( stack.pop()) / stack.pop());
            } else {
              stack.push(parseFloat(e));
            }
          });
          setResult(stack[0]);
        }
      };

      const splitString = (string) => {
        let elements = string.split(",");
        return elements;
      };

      const validateRegex = (inputArray) => {
        let validationArray = Array(inputArray.length).fill(0);

        inputArray.forEach((element, index) => {
            if (numberRegex.test(element) || arithmeticRegex.test(element)) {
                validationArray[index] = 1;
            } else {
                validationArray[index] = 0;
            }
        })

        let arraySum = validationArray.reduce((partialSum, a) => {
            return partialSum + a;
        }, 0);

        return arraySum === inputArray.length ? true : false;
      };

      const separateArrays = (array) => {
        setNumbersArray([]);
        setOperationsArray([]);

        if (array.length > 0 || array !== null) {
            array.forEach((element) => {
                if(numberRegex.test(element)) {
                    setNumbersArray((numbersArray) => [...numbersArray, element]);
                }
                if(arithmeticRegex.test(element)) {
                    setOperationsArray((operationsArray) => [
                        ...operationsArray, element
                    ]);
                }
            });
        }
      };

      
      const validateInput = () => {
        const userInputArray = splitString(userInput);
        const regex = validateRegex(userInputArray)

        if (
            userInput.length === 0 ||
            userInput === null ||
            userInput === undefined
        ) {
            setAlertMessage(
                <p className="alert">You did not enter anything!</p>
            ); return false;
        } else if (regex === false) {
            setAlertMessage(
                <p className="alert">Only numbers and arithmetic operators are valid!</p>
            ); return false;
        } 
         else if (numbersArray.length - operationsArray.length > 1) {
            setAlertMessage(
                <p className="alert">Something went wrong! Check the number of OPERANDS!</p>
            ); return false;
        }  else if (operationsArray.length - numbersArray.length > -1) {
            setAlertMessage(
                <p className="alert">Something went wrong! Check the number of OPERATORS!</p>
            ); return false;
        } else {
            setAlertMessage(null);
            return true;
        }
      };


       
      const handleChange = (e) => {
        e.preventDefault();
        setUserInput(e.target.value);
      };

      return (
        <div className="card">
            <div className="header">
                <h1>Reverse Polish Notation Calculator</h1>
            </div>
            <div className="calculator_body">
                <div className="calculator_input_group">
                    <input 
                    disabled={result !== null ? true : false}
                    className="calc_input"
                    placeholder="Enter the operand and operator: 2,3,4.8,*,+"
                    type="text"
                    value={
                        result !== null ? `${userInput} = ${result.toFixed(2)}` : userInput
                    }
                    onChange={(e) => {
                        handleChange(e);
                    }}/>
                    <div className="buttons_group">
                        <button 
                        className="calc_button"
                        onClick={() => calculatorCompute(userInput)}>
                            Compute
                        </button>
                        <button 
                        className="calc_button"
                        onClick={() => clearInput()}>
                            Clear
                        </button>
                    </div>
                </div>
                {alertMessage !== null ? alertMessage : <></>}
            </div>
        </div>
      );
}

export default Calculator