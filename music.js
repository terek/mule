/** @constructor */
Music = function(args, keyboard) {
  this.bassCount_ = args['maxBass'] - args['minBass'] + 1;
  this.trebleCount_ = args['maxTreble'] - args['minTreble'] + 1;
  // Set the name of the seventh note on the keyboard.
  $('#keypad #H').text(args['seventh']);
};

var localArgs = {
  'domain': 'music',
  'minBass': 13,  // H1
  'maxBass': 31,  // F4
  'minTreble': 25,  // G3
  'maxTreble': 43,  // D6
  'askOctave': 0,
  'seventh': 'B'  // or 'H'
};

Music.prototype.reset = function() {
  var count = this.bassCount_ + this.trebleCount_;
  var sequence = new Array(count);
  for (var j = 0; j < count; ++j) {
    sequence[j] = j;
  }
  this.dice_ = randomSample(sequence, args['iterations']);
  this.index_ = 0;
}

Music.prototype.next = function() {
  var dice = this.dice_[this.index_];
  this.index_ += 1;
  var clef = dice < this.bassCount_ ? 0 : 1;
  var i = (clef == 0 ?
           args['minBass'] + dice :
           args['minTreble'] + dice - this.bassCount_);
  var note = i % 7;
  var octave = (i - note) / 7;
  var notes =  'CDEFGA' + (args['seventh'] == 'H' ? 'H' : 'B');
  this.clef_ = clef;
  this.note_ = i;
  if (args['askOctave'] != 0) {
    this.result_ = notes[note] + '' + octave;
  } else {
    this.result_ = notes[note];
  }
  // Key for storage.
  this.key_ = this.result_;
  this.adjust();
}

Music.prototype.adjust = function() {
  Music.adjustGlobal();
  if (this.clef_ == 0) {
    Music.showBassNote(this.note_);
  } else {
    Music.showTrebleNote(this.note_);
  }
};

Music.prototype.result = function() {
  return this.result_;
};

Music.prototype.color = function(partial) {
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

Music.trebleNotePosition = function(i) {
  return 0.169 + 0.0263 * i;
};

Music.trebleRulePosition = function(i) {
  return 0.163 + 0.0263 * i;
};

Music.bassNotePosition = function(i) {
  return 0.609 + 0.0263 * i;
};

Music.bassRulePosition = function(i) {
  return 0.603 + 0.0263 * i;
};

Music.adjustGlobal = function() {
  var ratio = $('#clef').width() / 794.;
  // Need to shift rules and note by the amount that makes clef image centered
  // within #problem.
  var imShift = ($('#problem').width() - $('#clef').width()) / 2;

  // Resize notes and rules according to the size of the base image.
  $('#problem .note').width(ratio * 44.);
  $('#problem .note').height(ratio * 28.);
  $('#problem .note').css({left: (imShift + 0.4 * $('#clef').width()) + 'px'}); 
  $('#problem .rule').width(ratio * 74.);
  $('#problem .rule').height(ratio * 3.);
  $('#problem .rule').css({left: (imShift + 0.4 * $('#clef').width() - ratio * 15) + 'px'});


  // Position the rules.
  $('#gu2').css({top: (Music.trebleRulePosition(-3) * $('#clef').height()) + 'px'});
  $('#gu1').css({top: (Music.trebleRulePosition(-1) * $('#clef').height()) + 'px'});
  $('#gd1').css({top: (Music.trebleRulePosition(11) * $('#clef').height()) + 'px'});
  $('#gd2').css({top: (Music.trebleRulePosition(13) * $('#clef').height()) + 'px'});
  $('#fu2').css({top: (Music.bassRulePosition(-3) * $('#clef').height()) + 'px'});
  $('#fu1').css({top: (Music.bassRulePosition(-1) * $('#clef').height()) + 'px'});
  $('#fd1').css({top: (Music.bassRulePosition(11) * $('#clef').height()) + 'px'});
  $('#fd2').css({top: (Music.bassRulePosition(13) * $('#clef').height()) + 'px'});
};

Music.showBassNote = function(i) {
  if (i < 13 || i > 31) {
    $('#problem .extra').css({visibility: 'hidden'});
    return;
  }
  var r = Music.bassNotePosition(-5 + 31 - i);
  $('#note').css({
    top: (r * $('#clef').height()) + 'px'
  });

  $('#gu2').css({visibility: 'hidden'});
  $('#gu1').css({visibility: 'hidden'});
  $('#gd1').css({visibility: 'hidden'});
  $('#gd2').css({visibility: 'hidden'});
  $('#fu2').css({visibility: (i >= 30) ? 'visible' : 'hidden'});
  $('#fu1').css({visibility: (i >= 28) ? 'visible' : 'hidden'});
  $('#fd1').css({visibility: (i <= 16) ? 'visible' : 'hidden'});
  $('#fd2').css({visibility: (i <= 14) ? 'visible' : 'hidden'});
};

Music.showTrebleNote = function(i) {
  if (i < 25 || i > 43) {
    $('#problem .extra').css({visibility: 'hidden'});
    return;
  }
  var r = Music.trebleNotePosition(-5 + 43 - i);
  $('#note').css({
    top: (r * $('#clef').height()) + 'px'
  });

  $('#gu2').css({visibility: (i >= 42) ? 'visible' : 'hidden'});
  $('#gu1').css({visibility: (i >= 40) ? 'visible' : 'hidden'});
  $('#gd1').css({visibility: (i <= 28) ? 'visible' : 'hidden'});
  $('#gd2').css({visibility: (i <= 26) ? 'visible' : 'hidden'});
  $('#fu2').css({visibility: 'hidden'});
  $('#fu1').css({visibility: 'hidden'});
  $('#fd1').css({visibility: 'hidden'});
  $('#fd2').css({visibility: 'hidden'});
};
