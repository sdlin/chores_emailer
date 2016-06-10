// Column Number Definitions
var COLNUM_DATE = 1;
var COLNUM_EMAIL = 2;
var COLNUM_CHORE = 3;
var COLNUM_FIRST_SENT = 4;
var COLNUM_SECOND_SENT = 5;
var COLNUM_CURRENT_LINE = 7;

var ROWNUM_CURRENT_LINE = 2;

// 2nd Email Delay Period
var SECOND_EMAIL_DELAY_MILLIS = daysToMillis(5);


function main() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var currentRowNum = getCurrentRowNum(sheet);
  
  var emailNumToSend = whichEmailNumToSend(sheet, currentRowNum);
  if (emailNumToSend == null) {
    return;
  }
  
  sendEmail(sheet, currentRowNum, emailNumToSend);
  
  setSent(sheet, currentRowNum, emailNumToSend);
  updateCurrentLine(sheet, emailNumToSend, currentRowNum);
}

function updateCurrentLine(sheet, emailNumToSend, currentRowNum) {
  if (emailNumToSend == COLNUM_SECOND_SENT) {
     sheet.getRange(ROWNUM_CURRENT_LINE, COLNUM_CURRENT_LINE).setValue(currentRowNum + 1);
     SpreadsheetApp.flush();
  }
}

function sendEmail(sheet, currentRowNum, emailNumToSend) {
  var emailAddress = getEmailAddress(sheet, currentRowNum);
  var chore = getChore(sheet, currentRowNum);
  var subject = makeSubject(emailNumToSend, chore);
  
  var message = "";
  
  MailApp.sendEmail(emailAddress, subject, message);
}

function makeSubject(emailNumToSend, chore) {
  if (emailNumToSend == COLNUM_FIRST_SENT) {
    return "You have one week to clean the " + chore; 
  } else {
    return "Reminder: you still need to clean the " + chore;
  }
}

function whichEmailNumToSend(sheet, currentRowNum) {
  var scheduleEpochMillis = getScheduleTime(sheet, currentRowNum);
  if (Date.now() < scheduleEpochMillis) {
    return null;
  }
  
  if (!hasValue(sheet, currentRowNum, COLNUM_FIRST_SENT)) {
    return COLNUM_FIRST_SENT;
  }
  if (!hasValue(sheet, currentRowNum, COLNUM_SECOND_SENT) &&
      Date.now() > scheduleEpochMillis + SECOND_EMAIL_DELAY_MILLIS) {
    return COLNUM_SECOND_SENT;
  }
  
  return null;
}

function hasValue(sheet, row, col) {
  return !sheet.getRange(row, col, 1).isBlank();
}

function getScheduleTime(sheet, currentRowNum) {
  var value = sheet.getRange(currentRowNum, COLNUM_DATE).getValue();
  return Date.parse(value);
}

function getCurrentRowNum(sheet) {
  return getIntAt(sheet, ROWNUM_CURRENT_LINE, COLNUM_CURRENT_LINE);
}

function getIntAt(sheet, row, col) {
  var value = sheet.getRange(row, col).getValue();
  return parseInt(value);
}

function getEmailAddress(sheet, currentRowNum) {
   return sheet.getRange(currentRowNum, COLNUM_EMAIL).getValue(); 
}

function getChore(sheet, currentRowNum) {
  return sheet.getRange(currentRowNum, COLNUM_CHORE).getValue(); 
}

function setSent(sheet, currentRowNum, emailNumToSend) {
   sheet.getRange(currentRowNum, emailNumToSend).setValue(1);
   SpreadsheetApp.flush();
}

function daysToMillis(n) {
   return n * 86400000;
}