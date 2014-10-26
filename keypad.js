
/** @constructor */
Keypad = function(keypadNode, textCallback) {
  this.text_ = "";
  this.textCallback_ = textCallback;
  this.commandCallback_ = null;
  this.isActiveCallback_ = null;
  this.lastDown_ = null;
  this.keypadNode_ = keypadNode;
  for (var i = 0; i < 10; ++i) {
    var mouseDownMaker = function(digit) {
      return function(e) { this.mouseDown(e, digit); }
    };
    var downHandler = mouseDownMaker(i).bind(this);
    $(keypadNode).find('#'+i).mousedown(downHandler);
    $(keypadNode).find('#'+i).bind('touchstart', downHandler);
  }
  $(document).mousedown(function(e) {
    this.lastDown_ = null;
    return this.commandCallback_(e);
  }.bind(this));
  $(keypadNode).find('#B').mousedown(this.actionBackspace.bind(this));
};

Keypad.prototype.reset = function() {
  this.text_ = "";
  this.textCallback_(this.text_);
}

Keypad.prototype.actionDigit = function(e, d) {
  if (!this.isActiveCallback_()) {
    return;
  }
  this.text_ = this.text_ + d.toString();
  this.textCallback_(this.text_);
  e.stopPropagation();
  e.preventDefault();
};

Keypad.prototype.actionBackspace = function(e) {
  if (!this.isActiveCallback_()) {
    return;
  }
  if (this.text_.length > 0) {
    this.text_ = this.text_.substring(0, this.text_.length - 1);
    this.textCallback_(this.text_);
  }
  e.stopPropagation();
  e.preventDefault();
};

Keypad.prototype.keyDown = function(e) {
  var k = e.keyCode;
  if (48 <= k && k <= 57) {
    var digit = k - 48;
    return this.actionDigit(e, digit)
  } else if (k == 32) {
    return this.commandCallback_(e);
  } else if (k == 8) {
    return this.actionBackspace(e);
  }
};

Keypad.prototype.mouseDown = function(e, digit) {
  this.lastDown_ = digit;
  $(this.keypadNode_).find('#' + digit).css('background-color', '#BADA55');
  setTimeout(function() {
    $('.key').css('background-color', '');
  }, 300);
  this.actionDigit(e, digit);
};
