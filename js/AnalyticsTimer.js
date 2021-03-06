function AnalyticsTimer(category, variable, opt_label) {
  this.category = category;
  this.variable = variable;
  this.label = opt_label ? opt_label : undefined;
  this.start_time = null;
  this.elapsed = 0;
  this.min_threshold = null;
  this.max_threshold = null;
  this.min_clamp = false;
  this.max_clamp = true;
  return this;
}

AnalyticsTimer.prototype.start = function() {
  this.start_time = new Date().getTime();
  return this;
};

AnalyticsTimer.prototype.stop = function() {
  if (this.start_time !== null) {
    this.elapsed = this.elapsed + (new Date().getTime()) - this.start_time;
    this.start_time = null;
  }
  return this;
};

AnalyticsTimer.prototype.reset = function() {
  this.elapsed = 0;
  return this;
};

AnalyticsTimer.prototype.send = function() {

  this.stop(); // update the timer

  // If threshold criteria are not met, do not send
  if (
    ((this.min_threshold === null) || this.min_clamp || (this.elapsed >= this.min_threshold)) &&
    ((this.max_threshold === null) || this.max_clamp || (this.elapsed <= this.max_threshold))
  ) {

    // At this point, we should clamp
    if ((this.min_threshold !== null) && (this.elapsed < this.min_threshold)) this.elapsed = this.min_threshold;
    if ((this.max_threshold !== null) && (this.elapsed > this.max_threshold)) this.elapsed = this.max_threshold;

    window._gaq.push(['_trackTiming', this.category, this.variable, this.elapsed, this.label]);

  }

  this.start(); // keep the timer running

  return this;

};