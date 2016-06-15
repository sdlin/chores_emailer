// Time between notifications
var EMAIL_DELAY_PERIOD_MILLIS = daysToMillis(5);

// Max number of notifications
var MAX_EMAILS = 2;

// Column Number Definitions (1 indexed)
var COLNUM_DATE = 1;
var COLNUM_EMAIL = 2;
var COLNUM_CHORE = 3;
var COLNUM_EMAILS_LEFT = 4;

var SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1kHuLuwt6Wk3cRBKbw4N2qJ6DK-lnEvDhnBcOk_G-rQ0";


function main() {
  var data = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  
  for(var nRow=1; nRow < data.length; nRow++) {
    var date = data[nRow][COLNUM_DATE - 1];
    var email = data[nRow][COLNUM_EMAIL - 1];
    var chore = data[nRow][COLNUM_CHORE - 1];
    var emailsLeft = data[nRow][COLNUM_EMAILS_LEFT - 1];
    processRow(date, email, chore, emailsLeft, nRow);
  }
}


function processRow(date, email, chore, rawEmailsLeft, nRow) {
  if (date == null || email == null || chore == null) {
    return; 
  }
  var emailsLeft = getEmailsLeftInt(rawEmailsLeft);
  
  if (shouldSendEmail(date, emailsLeft)) {
    sendEmail(email, chore, emailsLeft);
    updateEmailsLeft(emailsLeft, nRow)
  }
}


function getEmailsLeftInt(rawData) {
  var emailsLeft = parseInt(rawData);
  if (isNaN(emailsLeft)) {
    emailsLeft = MAX_EMAILS;
  }
  return emailsLeft;
}


function shouldSendEmail(date, emailsLeft) {
  if (emailsLeft <= 0) {
    return false; 
  }
  var scheduledEpochMillis = Date.parse(date) + (MAX_EMAILS - emailsLeft) * EMAIL_DELAY_PERIOD_MILLIS;
  
  return Date.now() > scheduledEpochMillis;
}


function sendEmail(email, chore, emailsLeft) {
  var subject = makeSubject(emailsLeft, chore);
  if (emailsLeft > 1) {
    var message = "After you complete the chore, update the spreadsheet to have 0 " + 
      "notifications left, or you will get more notifications.\n" + SPREADSHEET_URL;
  } else {
    var message = ""; 
  }
  
  
  MailApp.sendEmail(email, subject, message);
}


function makeSubject(emailNumToSend, chore) {
  return "Clean the " + chore + ". " + emailNumToSend + " Reminders Left.";
}


function updateEmailsLeft(currentEmailsLeft, nRow) {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(nRow + 1, COLNUM_EMAILS_LEFT).setValue(currentEmailsLeft - 1);
  SpreadsheetApp.flush(); 
}


function daysToMillis(n) {
   return n * 86400000;
}