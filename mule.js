var args = getUrlArgs({
  'timeout': '15',
  'iterations': '10',
  'wait': '2',
  'type': 'mult1',
  'imageCount': '6',
  'minTime': '3',
  'maxTime': '11',
  'restrictedA': '2..10',
  'restrictedB': '2..10',
  'adaptive': false,
  'prefix': 'default'
});

imageIndex = function(t) {
  var i = 0;
  if (t >= args['maxTime']) {
    i = 1;
  } else if (t <= args['minTime']) {
    i = args['imageCount'];
  } else {
    var r = (args['maxTime'] - t) / (args['maxTime'] - args['minTime']);
    // r in (0, 1)
    i = Math.floor(r * (args['imageCount'] - 2)) + 2;
  }
  return i;
}

Storage.addTime = function(key, time) {
  var storedTime = Storage.getTime(key);
  if (time < storedTime) {
    window.localStorage.setItem(args['prefix'] + '-' + key, time);
  }
};

Storage.getTime = function(key) {
  var storedTime = window.localStorage.getItem(args['prefix'] + '-' + key);
  return storedTime ? parseFloat(storedTime) : parseFloat(args['timeout']);
};

Statistics = function() {
  this.times_ = null;
  this.correct_ = null;
  this.numCorrect = null;
  this.reset();
};

Statistics.prototype.reset = function() {
  this.times_ = [];
  this.correct_ = [];
  this.numCorrect = 0;
};

Statistics.prototype.addTime = function(t, correct) {
  this.times_.push(t);
  this.correct_.push(correct);
  if (correct) {
    ++this.numCorrect;
  }
};

Statistics.prototype.getAvgTime = function() {
  var avgTime = 0;
  if (this.times_.length > 0) {
    for (var i = 0; i < this.times_.length; ++i) {
      avgTime += this.times_[i];
    }
    avgTime /= this.times_.length;
  }
  return avgTime;
};

Statistics.createBullets = function(root) {
  $(root).empty();
  for (var i = 0; i < args['iterations']; ++i) {
    var bullet = $('<div>').text('•');
    bullet.appendTo(root)
      .attr('id',  i.toString());
  }
}

Statistics.prototype.colorBullets = function(root) {
  for (var i = 0; i < args['iterations']; ++i) {
    var color = 'black';
    if (this.correct_.length > i) {
      color = this.correct_[i] ? 'green' : 'red';
    }
    $(root).find('#' + i).css('color', color);
  }
}


/** @constructor */
Control = function() {
  this.currState_ = State.State.READY;
  this.count_ = -1;
  this.restrictedA_ = Problem.parseIntRangesString(args['restrictedA']);
  this.countA_ = Problem.getRangeArrayCount(this.restrictedA_);
  this.restrictedB_ = Problem.parseIntRangesString(args['restrictedB']);
  this.countB_ = Problem.getRangeArrayCount(this.restrictedB_);
  this.stratifiedSample_ = multiStratifiedSample(this.countA_, this.countB_, args['iterations']);
  this.problem_ = null;
  this.state_ = new State(args);
  this.keypad_ = new Keypad($('#keypad'), this.textChanged_.bind(this));
  this.statistics_ = new Statistics();
  
  this.state_.stateCallback_ = this.updateState.bind(this);
  this.keypad_.commandCallback_ = this.state_.toggle.bind(this.state_);
  this.keypad_.isActiveCallback_ = this.state_.isActive.bind(this.state_);

  Statistics.createBullets('#stats');
  $(document.body).keydown(this.keypad_.keyDown.bind(this.keypad_));

  this.state_.init();
 };

Control.prototype.statElem_ = function(i) {
  return $('#stats #' + i);
};

Control.prototype.nextProblem_ = function() {
  ++this.count_;
  var sample = this.stratifiedSample_[this.count_];
  this.problem_ = new Problem(
    args,
    Problem.getRangeArrayElement(this.restrictedA_, sample[0]),
    Problem.getRangeArrayElement(this.restrictedB_, sample[1]));
  this.keypad_.reset();
  this.statElem_(this.count_).css('color', 'yellow');
}

Control.prototype.nextGame_ = function() {
  this.count_ = -1;
  this.problem_ = null;
  this.keypad_.reset();
  this.statistics_.reset();
  for (var i = 0; i < args['iterations']; ++i) {
    this.statElem_(i).css('color', 'black');
  }
}

Control.prototype.textChanged_ = function(partial) {
  var color = partial != '' ? this.problem_.color(partial) : 'black';
  $("#result").text(partial);
  $("#result").css('color', color);
  if (color == 'green') {
    this.state_.goCompleted();
  }
};

Control.prototype.addTime = function(correct) {
  var time = this.state_.timeSpent();
  this.statistics_.addTime(time, correct);
  Storage.addTime(this.problem_.key_, time);
};

Control.prototype.updateState = function(prevState, nextState) {
  if (nextState == State.State.COMPLETED) {
    this.addTime(true);
    this.statElem_(this.count_).css('color', 'green');
    $('#result').css('background', 'green');
    $('#result').css('color', 'white');
  } else if (nextState == State.State.TIMEOUT) {
    this.addTime(false);
    this.statElem_(this.count_).css('color', 'red');
    $('#result').css('background', 'red');
    $('#result').css('color', 'white');
  } else if (nextState == State.State.PLAY) {
    $('#curtain').hide();
    if (prevState == State.State.READY) {
      $('#result').css('background', '');
      $('#result').css('color', 'black');
      $('#problem').show();
      $('#stats').show();
      this.nextProblem_();
    }
  } else if (nextState == State.State.READY) {
    $('#curtain').show();
    $('#final').hide();
    if (prevState == State.State.START ||
        prevState == State.State.END) {
      $('#problem').hide();
      $('#stats').hide();
    }
    if (prevState == State.State.COMPLETED ||
        prevState == State.State.TIMEOUT) {
      $('#result').css('background', 'green');
      $('#result').css('color', 'white');
      $('#result').text(this.problem_.result());
      $('#curtain').show();
      if (this.count_ == args['iterations'] - 1) {
        this.state_.goWin();
      }
    }
    if (prevState == State.State.END) {
      // Reset game.
      this.nextGame_();
    }
  } else if (nextState == State.State.WIN) {
    var avgTime = this.statistics_.getAvgTime();
    var i = imageIndex(avgTime);
    var imgSrc = 'images/g/' + pad(i, 2) + '.png';
    $('#prizebox').css('background-image', 'url("' + imgSrc + '")'); 
    var timeStr = avgTime.toFixed(2);
    $('#time').text(timeStr);
    //$('#ratio').text(this.statistics_.numCorrect + ' / ' + args['iterations']);
    Statistics.createBullets('#ratio');
    this.statistics_.colorBullets('#ratio');
    $('#final').show();
  }
}

$(document).ready(function(){
  var control = new Control();
});
