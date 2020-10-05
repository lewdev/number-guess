var DateUtil = (function() {
  var monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  var dayOfWeekNames = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  function format(date, patternStr){
      if (!patternStr) {
          patternStr = 'M/d/yyyy';
      }
      var day = date.getDate(),
          month = date.getMonth(),
          year = date.getFullYear(),
          hour = date.getHours(),
          minute = date.getMinutes(),
          second = date.getSeconds(),
          miliseconds = date.getMilliseconds(),
          h = hour % 12,
          hh = twoDigitPad(h),
          HH = twoDigitPad(hour),
          mm = twoDigitPad(minute),
          ss = twoDigitPad(second),
          aaa = hour < 12 ? 'AM' : 'PM',
          EEEE = dayOfWeekNames[date.getDay()],
          EEE = EEEE.substr(0, 3),
          dd = twoDigitPad(day),
          M = month + 1,
          MM = twoDigitPad(M),
          MMMM = monthNames[month],
          MMM = MMMM.substr(0, 3),
          yyyy = year + "",
          yy = yyyy.substr(2, 2)
      ;
      // checks to see if month name will be used
      patternStr = patternStr
        .replace('hh', hh).replace('h', h)
        .replace('HH', HH).replace('H', hour)
        .replace('mm', mm).replace('m', minute)
        .replace('ss', ss).replace('s', second)
        .replace('S', miliseconds)
        .replace('dd', dd).replace('d', day)
        
        .replace('EEEE', EEEE).replace('EEE', EEE)
        .replace('yyyy', yyyy)
        .replace('yy', yy)
        .replace('aaa', aaa);
      if (patternStr.indexOf('MMM') > -1) {
          patternStr = patternStr
            .replace('MMMM', MMMM)
            .replace('MMM', MMM);
      }
      else {
          patternStr = patternStr
            .replace('MM', MM)
            .replace('M', M);
      }
      return patternStr;
  }
  function twoDigitPad(num) {
      return num < 10 ? "0" + num : num;
  }
  return {
    format: format
  };
})();