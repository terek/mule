/** @constructor */
Maths = function(args, keyboard) {
  this.restrictedA_ = Maths.parseIntRangesString_(args['restrictedA']);
  this.countA_ = Maths.getRangeArrayCount_(this.restrictedA_);
  this.restrictedB_ = Maths.parseIntRangesString_(args['restrictedB']);
  this.countB_ = Maths.getRangeArrayCount_(this.restrictedB_);
};

var localArgs = {
  'domain': 'maths',
  'type': 'mult1',
  'restrictedA': '2..10',
  'restrictedB': '2..10',
  'swapAB': true,
};

Maths.prototype.reset = function() {
  this.dice_ = multiStratifiedSample(this.countA_, this.countB_, parseInt(args['iterations']));
  this.swap_ = new Array(parseInt(args['iterations']));
   for (var i = 0; i < this.swap_.length; ++i) {
    this.swap_[i] = randInt(0, 1);
  }
  this.index_ = 0;
};

Maths.prototype.next = function() {
  var sample = this.dice_[this.index_];
  var doSwap = this.swap_[this.index_] != 0;
  this.index_ += 1;

  var a = Maths.getRangeArrayElement_(this.restrictedA_, sample[0]);
  var b = Maths.getRangeArrayElement_(this.restrictedB_, sample[1]);
  if (args['swapAB'] && doSwap) {
    var tmp = a;
    a = b;
    b = tmp;
  }
  var resultOperandsAndOperator = Maths.computeResultOperandsAndOperator_(a, b);
  $('#operandA').text(resultOperandsAndOperator[1][0]);
  $('#operandB').text(resultOperandsAndOperator[1][1]);
  $('#operator').text(resultOperandsAndOperator[2]);

  this.result_ = resultOperandsAndOperator[0].toString();
  // Key for storage.
  this.key_ = args['type'] + '_' + a + '_' + b;
  this.adjust();
}

Maths.prototype.adjust = function() {
};

Maths.prototype.result = function() {
  return this.result_;
};

Maths.prototype.color = function(partial) {
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

Maths.computeResultOperandsAndOperator_ = function(a, b) {
  var type = args['type'];
  var operands = [a, b];
  var operator = null;
  var result = null;
  if (type == 'mult1') {
    operator = '×';
    result = a * b;
  } else if (type == 'div1') {
    operator = ':';
    operands[0] = a * b;
    operands[1] = a;
    result = b;
  } else if (type == 'add1') {
    operator = '+';
    result = a + b;
  } else {
    console.error('unknown type');
  }
  return [result, operands, operator];
}

Maths.parseIntRangesString_ = function(restricted) {
  return restricted.split(',').map(function(x) {
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
};

Maths.getRangeArrayCount_ = function(arr) {
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
  return count;
};

Maths.getRangeArrayElement_ = function(arr, index) {
  count = 0;
  for (var j = 0; j < arr.length; ++j) {
    if (typeof(arr[j]) == "number") {
      if (count == index) {
        return arr[j];
      }
      count += 1;
    } else {
      var nextCount = count + arr[j][1] - arr[j][0] + 1;
      if (count <= index && index < nextCount) {
        return arr[j][0] + index - count;
      }
      count = nextCount;
    }
  }
  console.error('error finding ', index, ' th element in ', arr);
  return -1;
};
