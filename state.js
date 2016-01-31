

/** @constructor */
State = function(args) {
  this.state = State.State.START;
  this.startTime_ = null;
  this.interval_ = null;
  this.stateCallback_ = null;
};

/** @enum {string} */
State.State = {
  START: 'start',
  READY: 'ready',
  PLAY: 'play',
  TIMEOUT: 'timeout',
  COMPLETED: 'completed',
  PREWIN: 'prewin',
  WIN: 'win',
  END: 'end'
};

State.prototype.init = function() {
  NProgress.configure({ trickle: false, showSpinner: false, minimum: 0.0 });  
  this.setState_(State.State.READY);
};

State.prototype.setState_ = function(state) {
  var prevState = this.state;
  this.state = state;
  this.stateCallback_(prevState, this.state);
};

State.prototype.goPlay_ = function() {
  this.interval_ = setInterval(this.updateProgress.bind(this), 100);
  this.setState_(State.State.PLAY);
};

State.prototype.goReady_ = function() {
  this.setState_(State.State.READY);
};

State.prototype.isActive = function() {
  return this.state == State.State.PLAY;
}

State.prototype.goTimeout = function() {
  clearInterval(this.interval_);
  this.interval_ = null;
  if (this.state == State.State.PLAY) {
    this.setState_(State.State.TIMEOUT);
    setTimeout(this.goReady_.bind(this), args['wait'] * 1000);
  }
};

State.prototype.goCompleted = function() {
  clearInterval(this.interval_);
  this.interval_ = null;
  NProgress.done();
  if (this.state == State.State.PLAY) {
    this.setState_(State.State.COMPLETED);
    setTimeout(this.goReady_.bind(this), args['wait'] * 1000);
  }
};

State.prototype.goPreWin = function() {
  this.setState_(State.State.PREWIN);
};

State.prototype.goWin = function() {
  this.setState_(State.State.WIN);
  setTimeout(this.goEnd_.bind(this), args['wait'] * 1000);
};

State.prototype.goEnd_ = function() {
  this.setState_(State.State.END);
};

State.prototype.toggle = function() {
  switch(this.state) {
  case State.State.READY:
    this.startTime_ = currentTime();
    this.goPlay_();
    break;
  case State.State.END:
    this.goReady_();
    break;
  case State.State.PREWIN:
    this.goWin();
    break;
  case State.State.PLAY:
  case State.State.TIMEOUT:
  case State.State.COMPLETED:
  case State.State.WIN:
    break;
  default:
    console.error('unknown state', this.state);
  }
};

State.prototype.timeSpent = function() {
  return currentTime() - this.startTime_;
}

State.prototype.updateProgress = function() {
  var ratio = this.timeSpent() / args['timeout'];
  NProgress.set(ratio);
  if (ratio >= 1) {
    this.goTimeout();
  }
};
