/** @constructor */
Music = function(args, keyboard) {
  this.bassCount_ = args['maxBass'] - args['minBass'] + 1;
  this.trebleCount_ = args['maxTreble'] - args['minTreble'] + 1;
  // Set the name of the seventh note on the keyboard.
  $('#keypad #H').text(args['seventh']);
  this.notes_ =  'CDEFGA' + (args['seventh'] == 'H' ? 'H' : 'B');

  // VexFlow setup.
  this.scoreNode_ = document.getElementById('score');
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

Music.prototype.adjust = function() {

  const notesStr = "CDEFGAB";
  const note = notesStr[this.note_% 7];
  const octave = Math.floor(this.note_ / 7);
  console.info(this.note_, this.clef_, note, octave);

  while (this.scoreNode_.firstChild) {
    this.scoreNode_.removeChild(this.scoreNode_.firstChild);
  }
  this.renderer_ = new Vex.Flow.Renderer(this.scoreNode_, Vex.Flow.Renderer.Backends.SVG);
  this.renderer_.resize(150, 350);
  var context = this.renderer_.getContext();
  context.save();
  var formatter = new Vex.Flow.Formatter();
  var voice = new Vex.Flow.Voice({
    num_beats: 1,
    beat_value: 4,
    resolution: Vex.Flow.RESOLUTION
  });

  //Vex.Flow.TIME4_4
  var stave1 = new Vex.Flow.Stave(0, 0, 100);
  stave1.addClef("treble");
  stave1.setContext(context).draw();

  var stave2 = new Vex.Flow.Stave(0, 80, 100);
  stave2.addClef("bass");
  stave2.setContext(context).draw();

  var stave = this.clef_ ? stave1 : stave2;
  voice.addTickables([
    new Vex.Flow.StaveNote({
      clef: (this.clef_ ? "treble" : "bass"),
      keys: [`${note}/${octave}`],
      duration: "4"
    })
  ]).setStave(stave);
  formatter.joinVoices([voice]).formatToStave([voice], stave);
  voice.draw(context, stave);

  this.scoreNode_.style.width = '';

  // Adjust svg node.
  const svgNode = this.scoreNode_.querySelector('svg');  
  const s = Math.min(
    this.scoreNode_.getBoundingClientRect().width / 100.,
    this.scoreNode_.getBoundingClientRect().height / 200.);
  svgNode.style.setProperty('--scale', s);  

  //svgNode.removeAttribute('width');
  //svgNode.removeAttribute('height');
  //svgNode.removeAttribute('viewBox');
  //svgNode.setAttribute('preserveAspectRatio', 'none');
  //svgNode.setAttribute('viewBox', "0 0 100 100");
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

  this.clef_ = clef;
  this.note_ = i;
  if (args['askOctave'] != 0) {
    this.result_ = this.notes_[note] + '' + octave;
  } else {
    this.result_ = this.notes_[note];
  }
  // Key for storage.
  this.key_ = this.result_;
  this.adjust();
}

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