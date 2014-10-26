/** @constructor */
Problem = function(args) {
  var a = Problem.randIntFromString(args['restrictedA']);
  var b = Problem.randIntFromString(args['restrictedB']);
  if (args['adaptive']) {
    var operands = Problem.getAdaptiveRandomOperands();
    a = operands[0];
    b = operands[1];
  }
  var resultAndOperator = Problem.computeResultAndOperator(a, b);
  $('#operandA').text(a);
  $('#operandB').text(b);
  $('#operator').text(resultAndOperator[1]);
  this.result_ = resultAndOperator[0].toString();
  this.key_ = a + resultAndOperator[1] + b;
  partial = '';
  
};

Problem.prototype.color = function(partial) {
  var color = null;
  if (partial == this.result_) {
    color = 'green';
  } else if (this.result_.indexOf(partial) == 0) {
    color = 'black';
  } else {
    color = 'red';
  }
  return color;
};

Problem.prototype.result = function() {
  return this.result_;
};

Problem.computeResultAndOperator = function(a, b) {
  var type = args['type'];
  var operator = null;
  var result = null;
  if (type == 'mult1') {
    operator = '×';
    result = a * b;
  } else if (type == 'add1') {
    operator = '+';
    result = a + b;
  } else {
    console.error('unknown type');
  }
  return [result, operator];
}

Problem.randIntFromString = function(restricted) {
  var arr = restricted.split(',').map(function(x) { return parseInt(x); });
  var i = randInt(0, arr.length - 1);
  return arr[i];
};

Problem.getAdaptiveRandomOperands = function() {
  var limitArray = [];
  var totalTime = 0.;
  for (a = 2; a < 10; ++a) {
    for (b = 2; b < 10; ++b) {
      var resultAndOperator = Problem.computeResultAndOperator(a, b);
      var key = a + resultAndOperator[1] + b;
      var t = Storage.getTime(key);
      totalTime += t;
      limitArray.push([totalTime, a, b]);
    }
  }
  var randomTime = Math.random() * totalTime;
  var i = 0;
  for (i = 1; i < limitArray.length; ++i) {
    if (randomTime < limitArray[i][0]) {
      break;
    }
  }
  return [limitArray[i][1], limitArray[i][2]];
};

Problem.getTotalTime = function() {
  var totalTime = 0.;
  for (a = 2; a < 10; ++a) {
    for (b = 2; b < 10; ++b) {
      var resultAndOperator = Problem.computeResultAndOperator(a, b);
      var key = a + resultAndOperator[1] + b;
      var t = Storage.getTime(key);
      totalTime += t;
    }
  }
  return totalTime;
};
