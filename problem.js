/** @constructor */
Problem = function(args) {
  var a = Problem.randIntFromRangesString(args['restrictedA']);
  var b = Problem.randIntFromRangesString(args['restrictedB']);
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

// unused
Problem.randIntFromString = function(restricted) {
  var arr = restricted.split(',').map(function(x) { return parseInt(x); });
  var i = randInt(0, arr.length - 1);
  return arr[i];
};

Problem.randIntFromRangesString = function(restricted) {
  var arr = restricted.split(',').map(function(x) {
    var dash = x.indexOf('..');
    if (dash == -1) {
      return parseInt(x);
    }
    var range = x.split('..');
    if (range.length != 2) {
      console.error('invalid range', x);
    }
    return [parseInt(range[0]), parseInt(range[1])];
  });
  var i = randInt(0, arr.length - 1);
  var starts = [];
  var count = 0;
  for (var j = 0; j < arr.length; ++j) {
    starts.push(count);
    if (typeof(arr[j]) == "number") {
      count += 1;
    } else {
      count += arr[j][1] - arr[j][0] + 1;
    }
  }
  var i = randInt(0, count - 1);
  count = 0;
  for (var j = 0; j < arr.length; ++j) {
    if (typeof(arr[j]) == "number") {
      if (count == i) {
        return arr[j];
      }
      count += 1;
    } else {
      var nextCount = count + arr[j][1] - arr[j][0] + 1;
      if (count <= i && i < nextCount) {
        return arr[j][0] + i - count;
      }
      count = nextCount;
    }
  }
  console.error('error finding ', i, ' th element in ', arr);
  return -1;
};

Problem.getAdaptiveRandomOperands = function() {
  var limitArray = [];
  var totalTime = 0.;
  var a_arr = args['restrictedA'].split(',').map(function(x) { return parseInt(x); });
  var b_arr = args['restrictedB'].split(',').map(function(x) { return parseInt(x); });
  for (var ia = 0; ia < a_arr.length; ++ia) {
    var a = a_arr[ia];
    for (var ib = 0; ib < b_arr.length; ++ib) {
      var b = b_arr[ib];
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
