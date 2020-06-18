Keypad = function(keypadNode, textCallback) {
  this.text_ = "";
  this.textCallback_ = textCallback;
  this.commandCallback_ = null;
  this.isActiveCallback_ = null;
  this.lastDown_ = null;
  this.keypadNode_ = keypadNode;
  this.keypadNode_[0].querySelectorAll(".key").forEach((k) => {
    const id = k.id;
    const digit = k.textContent;
    var mouseDownMaker = function(digit) {
      return function(e) { this.mouseDown(e, digit); }
    };
    var downHandler = mouseDownMaker(digit).bind(this);
    $(keypadNode).find('#'+id).mousedown(downHandler);
    $(keypadNode).find('#'+id).bind('touchstart', downHandler);
  });
  $(document).mousedown(function(e) {
    this.lastDown_ = null;
    return this.commandCallback_(e);
  }.bind(this));
  $(keypadNode).find('#backspace').mousedown(this.actionBackspace.bind(this));

};

Keypad.prototype.reset = function() {
  this.text_ = "";
  this.textCallback_(this.text_);
}

Keypad.prototype.actionKey_ = function(e, ch) {
  if (!this.isActiveCallback_()) {
    return;
  }
  // If appending the next character leads to a valid result or prefix, we keep
  // the new char, otherwise it gets discarded, so no backspace is needed.
  if (this.textCallback_(this.text_ + ch)) {
    this.text_ = this.text_ + ch;
  }
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
    return this.actionKey_(e, digit.toString());
  } else if (65 <= k && k <= 72) {
    return this.actionKey_(e, String.fromCharCode(e.which));
  } else if (k == 32) {
    return this.commandCallback_(e);
  } else if (k == 8) {
    return this.actionBackspace(e);
  }
};

Keypad.prototype.mouseDown = function(e, digit) {
  this.lastDown_ = digit;
  console.info(digit);
  $(this.keypadNode_).find('#' + digit).css('background-color', '#BADA55');
  setTimeout(function() {
    $('.key').css('background-color', '');
  }, 300);
  this.actionKey_(e, digit);
};
