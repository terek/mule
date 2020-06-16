Object.extend = function(destination, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
    }
    return destination;
};

var args = getUrlArgs(Object.extend(localArgs, {
  'timeout': '15',
  'iterations': '5',
  'wait': '0.3',
  'imageCount': '6',
  'minTime': '3',
  'maxTime': '11',
  'adaptive': false,
  'prefix': 'default'  // for storage
}));

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


/** @constructor */
Control = function() {
  if (args['domain'] == 'music') {
    this.problem_ = new Music(args);
  } else {
    this.problem_ = new Maths(args);
  }
  this.state_ = new State(args);
  this.keypad_ = new Keypad($('#keypad'), this.textChanged_.bind(this));
  this.sumary_ = new Summary();

  this.state_.stateCallback_ = this.updateState.bind(this);
  this.keypad_.commandCallback_ = this.state_.toggle.bind(this.state_);
  this.keypad_.isActiveCallback_ = this.state_.isActive.bind(this.state_);

  Summary.createBullets('#summary');
  $(document.body).keydown(this.keypad_.keyDown.bind(this.keypad_));
  var control = this;
  $(window).resize(function() {
    if (control.problem_) {
      control.problem_.adjust();
    }
  });

  this.nextGame_();
  this.state_.init();
};

Control.prototype.statElem_ = function(i) {
  return $('#summary #' + i);
};

Control.prototype.nextProblem_ = function() {
  ++this.count_;
  this.problem_.next();
  this.keypad_.reset();
  this.statElem_(this.count_).css('color', 'yellow');
}

Control.prototype.nextGame_ = function() {
  this.count_ = -1;
  this.problem_.reset();
  this.keypad_.reset();
  this.sumary_.reset();
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
  // Return false only if wrong.
  return color != 'red';
};

Control.prototype.addTime = function(correct) {
  var time = this.state_.timeSpent();
  this.sumary_.addTime(time, correct);
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
      //$('#problem').hide();
      //$('#stats').hide();
    }
    if (prevState == State.State.COMPLETED ||
        prevState == State.State.TIMEOUT) {
      $('#result').css('background', 'green');
      $('#result').css('color', 'white');
      $('#result').text(this.problem_.result());
      $('#curtain').show();
      // If this was the last problem and the solution is correct, go to the win
      // state immediately. If solution is wrong, will need toggle to go to win.
      if (this.count_ == args['iterations'] - 1) {
        if (prevState == State.State.COMPLETED) {
          this.state_.goWin();
        } else {
          this.state_.goPreWin();
        }
      }
    }
    if (prevState == State.State.END) {
      // Reset game.
      this.nextGame_();
    }
  } else if (nextState == State.State.WIN) {
    var avgTime = this.sumary_.getAvgTime();
    var i = imageIndex(avgTime);
    var imgSrc = 'images/g/' + pad(i, 2) + '.png';
    $('#prizebox').css('background-image', 'url("' + imgSrc + '")'); 
    var timeStr = avgTime.toFixed(2);
    $('#time').text(timeStr);
    //$('#ratio').text(this.sumary_.numCorrect + ' / ' + args['iterations']);
    Summary.createBullets('#ratio');
    this.sumary_.colorBullets('#ratio');
    $('#final').show();
  }
}

$(document).ready(function(){
  var control = new Control();
});
