# Chores Emailer

This is a Google app script which sends chore reminder emails.
It's meant be an Add-on script to a Google spreadsheet.

## Spreadsheet layout

The spreadsheet should look like:

| A          | B                 | C         | D              | E              | F | G            |
|------------|-------------------|-----------|----------------|----------------|---|--------------|
| Date       | Email             | Chore     | 1st Email Sent | 2nd Email Sent |   | Current Line |
| 2016-06-20 | personA@gmail.com | Floors    | 1              |                |   | 2            |
| 2016-06-21 | personB@gmail.com | Bathrooms |                |                |   |              |


## Script Logic

The script should be set to run periodically (e.g. once a day) using a Time-driven trigger.

The number under `Current Line` is the row number that the script will look at.

If the current time isn't past the date, then no email will be sent.

Otherwise, if the 1st email hasn't been sent, then it will be sent, and the spreadsheet will be marked.

If the 1st email was already sent, the 2nd email will be sent if the the delay period has passed (see 2nd Email Delay Period constant in the script).

If both emails have been sent, then the current line will be updated to point to the next line.
