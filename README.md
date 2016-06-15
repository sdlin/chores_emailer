# Chores Emailer

This is a Google app script which sends chore reminder emails.
It's meant be an Add-on script to a Google spreadsheet.

## Spreadsheet layout

The spreadsheet should look like:

| A          | B                 | C         | D                  |
|------------|-------------------|-----------|--------------------|
| Date       | Email             | Chore     | Notifications Left |
| 2016-06-20 | personA@gmail.com | Floors    | 1                  |
| 2016-06-21 | personB@gmail.com | Bathrooms |                    |


## Script Logic

The script should be set to run periodically (e.g. once a day) using a Time-driven trigger.

This will go through all of the lines in the spreadsheet, determine if an email needs to be sent, and then sends an email.

Multiple notifications can be sent.  The time between notifications is specified in the script.


## Usage

After completing a chore, set the `Notifications Left` column to 0.