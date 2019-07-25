let prompt = require('prompt');
let char = require('chars.js');
let rs = require('readline-sync');
let math = require('mathjs');

//Defining Stack function
//This Class is cited from :
/*Groner, Loiane. Learning JavaScript data structures and algorithms:
  hone your skills by learning classic data structures and algorithms in JavaScript. 2nd ed.,
  Packt Publishing, 2016. Page 83 to Page 87*/
class Stack{
  constructor (){
    this.items = [];
  };
  push(element){
    this.items.push(element);
  };
  pop(){
    return this.items.pop();
  };
  peek(){
    return this.items[this.items.length - 1];
  };
  isEmpty(){
    return this.items.length == 0;
  };
  size(){
    return this.items.length;
  };
  clear(){
    this.items = [];
  };
  print(){
    console.log(this.items.toString());
  };
}

//creating a queue
//This class is cited from
/*Groner, Loiane. Learning JavaScript data structures and algorithms:
  hone your skills by learning classic data structures and algorithms in JavaScript. 2nd ed.,
  Packt Publishing, 2016. Page 97 to Page 100*/
class Queue{
  constructor() {
    this.items = [];
  };
  enqueue(element){
    this.items.push(element);
  };
  dequeue(){
    return this.items.shift();
  };
  front(){
    return this.items[0];
  };
  isEmpty(){
    return this.items.length == 0;
  };
  size(){
    return this.items.length;
  };
  clear(){
    this.items = [];
  };
  print(){
    //console.log(this.items.toString());
    for (var i = 0; i < this.items.length; i++) {
      //console.log(this.items[i] + ' ');
      process.stdout.write(this.items[i] + ' ');
    }
  };
}

//main function

let topNum, nextNum, answer;
let flag = true;                    //let the while loop running while true
let powFlat = false;                //assume  no pow Input

//defining the precedence of operator
let precedence = function(operator){
  switch(operator){
    case "POW":
      return 3;
    case '*':
    case '/':
    case '%':
      return 2;
    case '+':
    case '-':
      return 1;
    default:
      return 0;
  }
}

while (flag) {
  let infixQ = new Queue();
  //read the user input string as math problem
  let input = rs.question('input a math problem, such as (2 POW 5 - 1)/2, input "quit" to exit\n');
  //split the input problem with regular expression
  let splitInput = input.split(/([0-9]+\.?[0-9]*|\+|\-|\*|\/|\(|\)|POW|\%)/);

  let isMath = true;                  //check whether user input a correct math problem
  //if the user input quit, set the flag to false, stop the main loop
  if (input === "quit") {
    flag = false;
    isMath = false;
    break;
  }
  if (input === ""){
    isMath = false;
    console.log("Do not input nothing. Please try again");
  }
  //determine whether the string have invalid character and enqueue the string into Queue
  for(let i = 0; i < input.length; i++){
    if(input[i] != ' '){
      if((input[i] >= '9' || input[i] <= '0') && input[i] !== '+' && input[i] !== '-'
       && input[i] !== '*' && input[i] !== '/' && input[i] !== '%'
       && input[i] !== '(' && input[i] !== ')' && input[i] !== '.' && flag == true){
         isMath = false;
      }
    }
    //if the operator "POW" is detected , set the powFlat to true
    if (input[i] == 'P') {
      if (input[i-1] <= '9' && input[i-1] >= '0' && input[i+1] == 'O'
          && input[i+2] == 'W' && input[i+3] <= '9' && input[i+3] >= '0') {
        powFlat = true;
      }
    }
    //if the character '/' follow by 0, it will not be a valid math problem
    if (input[i] == '/') {
      if (input[i+1] == '0') {
        isMath = false;
        console.log("Cannot devide by zero. Please try again");
      }
    }
  }
  //if the powFlat is true, it will be a valid math problem
  if (powFlat = true) {
    isMath = true;
  }

  //use the splitted input string to enqueue
  for (var i = 0; i < splitInput.length; i++) {
    if (splitInput[i] !== '' && splitInput[i] !== ' ') {

      infixQ.enqueue(splitInput[i]);
    }
  }

  //when the isMath flag is true, which means the input problem is valid, then convert and calculate the value
  if (isMath&&true) {
    console.log('the problem is \n' + input);
    let postQ = convertInfixtoPostfix(infixQ);
    console.log('The postfix order of the math problem is ');
    postQ.print();
    let value = calculatePostfix(postQ);
    if (value == "Infinity") {
      console.log("The processing of problem come to devide by zero, please try again");
    } else {
      console.log('The result of the problem is ' + value);
    }
  }
  else {
    console.log("Bad token input, Please try again\n");         //else output the error message, try again
  }
}

console.log("Program exit.");
//function convert the infix into postfix
//This function is cited From
/*
“An Application of Stacks and Queues.” Stevens Institute of Technology. Available at
https://sit.instructure.com/courses/23566/files/3473659?module_item_id=522576
*/
function convertInfixtoPostfix(infixQ){
  let opStack = new Stack();
  let postQ = new Queue();

  while(!infixQ.isEmpty()){
    t = infixQ.front();
    infixQ.dequeue();
    if(t >= '0' && t <= '9')
      postQ.enqueue(t);
    else if(opStack.isEmpty())
      opStack.push(t);
    else if(t === '(')
      opStack.push(t);
    else if(t === ')'){
      while(opStack.peek() !== '('){
        postQ.enqueue(opStack.peek());
        opStack.pop();
      }
      opStack.pop();
    }
    else{
      while((!opStack.isEmpty()) && (opStack.peek() !== '(') && (precedence(t) <= precedence(opStack.peek()))){
        postQ.enqueue(opStack.peek());
        opStack.pop();
      }
    opStack.push(t);
    }
  }
  while(!opStack.isEmpty()){
    postQ.enqueue(opStack.peek());
    opStack.pop();
  }

  return postQ;
}
//function calculate the postfix
//This function is cited From
/*
“An Application of Stacks and Queues.” Stevens Institute of Technology. Available at
https://sit.instructure.com/courses/23566/files/3473659?module_item_id=522576
*/
function calculatePostfix(postQ){
  let eval = new Stack();

  while(!postQ.isEmpty()){
    t = postQ.front();
    postQ.dequeue();
    if (t >= '0' && t <= '9')
      eval.push(t);
    else{
      topNum = eval.peek();
      eval.pop();
      nextNum = eval.peek();
      eval.pop();

      switch(t){
        case "+":
  	      answer = math.add(nextNum, topNum);
  	      break;
        case '-':
  	      answer = nextNum - topNum;
  	      break;
        case '*':
  	      answer = nextNum * topNum;
  	      break;
        case '/':
  	      answer = nextNum / topNum;
  	      break;
        case '%':
  	      answer = math.mod(nextNum, topNum);
          break;
        case "POW":
          answer = math.pow(nextNum, topNum);
          break;
      }

      let roundAnswer = math.round(answer, 2);

    eval.push(roundAnswer);
    }
  }

  return eval.peek();
}
