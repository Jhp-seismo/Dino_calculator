'use client';

import { useState } from 'react';

type Emotion = 'neutral' | 'happy' | 'sad' | 'excited' | 'confused' | 'bored' | 'mischievous';

export default function Calculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [emotion, setEmotion] = useState<Emotion>('neutral');
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState<number | null>(null);
  const [degrees, setDegrees] = useState(true); // true for degrees, false for radians

  const handleButtonClick = (value: string) => {
    switch (value) {
      case '=':
        calculateResult();
        break;
      case 'C':
        setInput('');
        setResult('');
        setEmotion('neutral');
        break;
      case 'AC':
        setInput('');
        setResult('');
        setEmotion('neutral');
        setHistory([]);
        setMemory(null);
        break;
      case '←':
        setInput((prev) => prev.slice(0, -1));
        break;
      case 'sin':
        applyTrigFunction('sin');
        break;
      case 'cos':
        applyTrigFunction('cos');
        break;
      case 'tan':
        applyTrigFunction('tan');
        break;
      case 'log':
        appendFunction('Math.log10');
        break;
      case 'ln':
        appendFunction('Math.log');
        break;
      case 'π':
        setInput((prev) => prev + 'Math.PI');
        break;
      case 'e':
        setInput((prev) => prev + 'Math.E');
        break;
      case 'x²':
        setInput((prev) => prev + '**2');
        break;
      case 'x³':
        setInput((prev) => prev + '**3');
        break;
      case '√':
        appendFunction('Math.sqrt');
        break;
      case '∛':
        appendFunction('Math.cbrt');
        break;
      case '!':
        calculateFactorial();
        break;
      case 'mod':
        setInput((prev) => prev + '%');
        break;
      case '(':
        setInput((prev) => prev + '(');
        break;
      case ')':
        setInput((prev) => prev + ')');
        break;
      case 'MS':
        if (result) {
          try {
            setMemory(parseFloat(result));
          } catch {
            console.error('Cannot store in memory');
          }
        }
        break;
      case 'MR':
        if (memory !== null) {
          setInput((prev) => prev + memory);
        }
        break;
      case 'MC':
        setMemory(null);
        break;
      case 'M+':
        if (memory !== null && result) {
          try {
            setMemory(memory + parseFloat(result));
          } catch {
            console.error('Cannot add to memory');
          }
        }
        break;
      case 'M-':
        if (memory !== null && result) {
          try {
            setMemory(memory - parseFloat(result));
          } catch {
            console.error('Cannot subtract from memory');
          }
        }
        break;
      case 'D/R':
        setDegrees(!degrees);
        break;
      default:
        setInput((prev) => prev + value);
        break;
    }
  };

  const calculateResult = () => {
    try {
      // Replace certain tokens for evaluation
      const expression = input
        .replace(/Math\.PI/g, '(' + Math.PI + ')')
        .replace(/Math\.E/g, '(' + Math.E + ')');

      // Safely evaluate the expression
      const evalResult = Function('"use strict";return (' + expression + ')')();
      setResult(String(evalResult));
      setHistory((prev) => [...prev, `${input} = ${evalResult}`]);
      
      // Set emotion based on result
      if (evalResult > 100) {
        setEmotion('excited');
      } else if (evalResult < 0) {
        setEmotion('sad');
      } else if (evalResult === 0) {
        setEmotion('bored');
      } else if (evalResult === 69 || evalResult === 420) {
        setEmotion('mischievous');
      } else {
        setEmotion('happy');
      }
    } catch {
      setResult('Error');
      setEmotion('confused');
    }
  };

  const applyTrigFunction = (func: string) => {
    if (input) {
      try {
        // Get the current input value
        const value = Function('"use strict";return (' + input + ')')();
        
        // Convert to radians if in degrees mode
        const angleInRadians = degrees ? value * (Math.PI / 180) : value;
        
        let result;
        switch (func) {
          case 'sin':
            result = Math.sin(angleInRadians);
            break;
          case 'cos':
            result = Math.cos(angleInRadians);
            break;
          case 'tan':
            result = Math.tan(angleInRadians);
            break;
          default:
            result = 0;
        }
        
        setResult(String(result));
        setInput(`${func}(${input})`);
      } catch {
        setResult('Error');
        setEmotion('confused');
      }
    } else {
      appendFunction(`Math.${func}`);
    }
  };

  const appendFunction = (func: string) => {
    setInput((prev) => prev + `${func}(`);
  };

  const calculateFactorial = () => {
    if (input) {
      try {
        // Parse current input as a number
        const num = Function('"use strict";return (' + input + ')')();
        
        if (num < 0 || !Number.isInteger(num)) {
          throw new Error('Factorial only works with non-negative integers');
        }
        
        let factorial = 1;
        for (let i = 2; i <= num; i++) {
          factorial *= i;
        }
        
        setResult(String(factorial));
        setInput(`${input}!`);
      } catch {
        setResult('Error');
        setEmotion('confused');
      }
    }
  };

  const getEmotionFace = () => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'excited': return '😲';
      case 'confused': return '😵';
      case 'bored': return '😐';
      case 'mischievous': return '😏';
      default: return '😶';
    }
  };

  const getEmotionMessage = () => {
    switch (emotion) {
      case 'happy': return '계산이 정확해요!';
      case 'sad': return '음수가 나오면 슬퍼요...';
      case 'excited': return '와, 정말 큰 숫자네요!';
      case 'confused': return '이 계산은 이해할 수 없어요...';
      case 'bored': return '0은 너무 심심해요...';
      case 'mischievous': return '히히, 좋은 숫자네요.';
      default: return '공학용 계산기를 이용해보세요!';
    }
  };

  // Scientific calculator buttons in groups
  const basicButtons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  const scientificButtons = [
    'sin', 'cos', 'tan', 'log',
    'ln', 'π', 'e', 'x²',
    'x³', '√', '∛', '!',
    'mod', '(', ')', 'D/R'
  ];

  const memoryButtons = ['MS', 'MR', 'MC', 'M+', 'M-'];
  const clearButtons = ['C', '←', 'AC'];

  return (
    <div className="w-full max-w-md overflow-hidden relative">
      {/* 공룡 머리 */}
      <div className="bg-green-600 dark:bg-green-700 rounded-t-[100px] pt-10 pb-2 px-6 relative">
        {/* 공룡 눈 - 왼쪽 */}
        <div className="absolute top-6 left-10 w-10 h-10 bg-white dark:bg-gray-200 rounded-full flex items-center justify-center">
          <div className="w-5 h-5 bg-black rounded-full relative">
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        
        {/* 공룡 눈 - 오른쪽 */}
        <div className="absolute top-6 right-10 w-10 h-10 bg-white dark:bg-gray-200 rounded-full flex items-center justify-center">
          <div className="w-5 h-5 bg-black rounded-full relative">
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div className="pt-8 pb-10 relative">
          <h1 className="text-xl font-bold text-white text-center mb-1">공학용 공룡 계산기</h1>
          <div className="text-xs text-green-200 text-center">
            {degrees ? '각도: 도(Degree)' : '각도: 라디안(Radian)'} 
            {memory !== null && ' | Memory: ' + memory}
          </div>
          
          {/* 감정 표현 (입 부분) - 글자 아래로 이동 */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-5xl z-10">
            {getEmotionFace()}
          </div>
        </div>
      </div>
      
      {/* 공룡 몸통 (계산기 메인 부분) */}
      <div className="bg-green-500 dark:bg-green-600 p-4 pt-10 relative z-0"> 
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 mb-2 min-h-10 text-right text-gray-800 dark:text-gray-200 overflow-hidden break-all shadow-inner">
          {input || '0'}
        </div>
        <div className="bg-green-100 dark:bg-green-900 rounded-lg p-2 min-h-10 text-right font-bold text-green-800 dark:text-green-200 overflow-hidden break-all shadow-inner">
          {result || '0'}
        </div>
        <p className="mt-2 text-center text-sm italic text-white">
          {getEmotionMessage()}
        </p>
        
        {/* 버튼 부분 */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {memoryButtons.map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className="flex-1 bg-green-300 hover:bg-green-400 dark:bg-green-800 dark:hover:bg-green-700 text-green-800 dark:text-green-200 rounded text-sm py-1 shadow"
              >
                {btn}
              </button>
            ))}
          </div>
          
          <div className="flex gap-1 mb-2">
            {clearButtons.map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={`flex-1 shadow ${
                  btn === 'C' 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : btn === 'AC'
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                } rounded py-2`}
              >
                {btn}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-8 gap-1">
            <div className="col-span-4 grid grid-cols-4 gap-1">
              {basicButtons.map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleButtonClick(btn)}
                  className={`rounded py-3 text-center text-lg font-medium transition-colors shadow
                    ${btn === '=' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                    ${!['=', '+', '-', '*', '/'].includes(btn) ? 'bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900' : ''}
                    ${['+', '-', '*', '/'].includes(btn) ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-300 dark:hover:bg-green-700' : ''}
                  `}
                >
                  {btn}
                </button>
              ))}
            </div>
            
            <div className="col-span-4 grid grid-cols-4 gap-1 relative z-20">
              {scientificButtons.map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleButtonClick(btn)}
                  className="bg-green-200 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-700 text-green-800 dark:text-green-200 rounded py-2 text-sm shadow"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 공룡 발 */}
      <div className="bg-green-500 dark:bg-green-600 pt-4">
        <div className="flex justify-between pb-2">
          <div className="w-16 h-8 bg-green-600 dark:bg-green-700 rounded-b-full ml-4"></div>
          <div className="w-16 h-8 bg-green-600 dark:bg-green-700 rounded-b-full mr-4"></div>
        </div>
      </div>
      
      {/* 공룡 꼬리 - z-index 조정 */}
      <div className="absolute -right-8 top-1/2 w-20 h-12 bg-green-600 dark:bg-green-700 rounded-r-full transform rotate-12 z-0"></div>
      
      {/* 계산 기록 */}
      {history.length > 0 && (
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">계산 기록</h3>
          <div className="max-h-32 overflow-y-auto">
            {history.map((item, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400 py-1 border-b border-green-100 dark:border-green-800">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 