Summary = function() {
  this.times_ = null;
  this.correct_ = null;
  this.numCorrect = null;
  this.reset();
};

Summary.prototype.reset = function() {
  this.times_ = [];
  this.correct_ = [];
  this.numCorrect = 0;
};

Summary.prototype.addTime = function(t, correct) {
  this.times_.push(t);
  this.correct_.push(correct);
  if (correct) {
    ++this.numCorrect;
  }
};

Summary.prototype.getAvgTime = function() {
  var avgTime = 0;
  if (this.times_.length > 0) {
    for (var i = 0; i < this.times_.length; ++i) {
      avgTime += this.times_[i];
    }
    avgTime /= this.times_.length;
  }
  return avgTime;
};

Summary.createBullets = function(root) {
  $(root).empty();
  for (var i = 0; i < args['iterations']; ++i) {
    var bullet = $('<div>').text('•');
    bullet.appendTo(root)
      .attr('id',  i.toString());
  }
}

Summary.prototype.colorBullets = function(root) {
  for (var i = 0; i < args['iterations']; ++i) {
    var color = 'black';
    if (this.correct_.length > i) {
      color = this.correct_[i] ? 'green' : 'red';
    }
    $(root).find('#' + i).css('color', color);
  }
}
