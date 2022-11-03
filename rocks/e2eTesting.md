# Usecases for End to End Testing Sunday Peak

**One day this will be converted to automated test cases, but for now it's just some notes**

## Load Page

- Map shows up
- Adventures show up
- Login and Create User buttons appear
- Adventure button shows up (although I don't know why currently)
  - Eventually this will contain the search for adventures bar and you don't need to be logged in for that
- Map is navigable
- 'Sunday Peak' logo shows up
- 'Sunday Peak' logo is clickable and goes to the about page
  - The about page loads
  - The Login and Create User buttons work
- When scrolling to another area, other adventures load

## Create a User

- clicking the create user button should open the new user panel
- happy path creates a new user
- when a new user is created an alert should appear on the page saying a new user was created
- sad paths include
  - not filling out one of the fields
  - invalid passwords
  - invalid emails
  - not agreeing to the terms and conditions
- sad paths should give a meaningful alert to the user on what they should do to fix it
- re-typing in any field should clear the error
- clicking **Login to Sunday Peak** should switch to the login panel

### Post Create Content

- the user panel shows the new user and a random colored square as the profile picture
- the back button should close the panel
- the new user can be edited
- a new photo can be added by clicking **Add a new photo**
- the photo should persist when reloading the page
- edits should be saved and persist when the page is re-rendered
- there should be a cancel button on the edit page
- there should be 0s in **Completed** and **Friends**
- there shouldn't be anything in **Todos** or ** Completed Activities**
- should be able to toggle from completed to friends by clicking on the buttons
- should be able to add a new photo
- the photo should persist on page reload
- in the console under **localStorage** a token should be present
- should be able to logout of the account
- the token shouldn't still be in **localStorage**
- the create user and loging buttons should return at the top left corner of the page

## Login a User

- clicking the login button should should the login panel
- entering the username and password used to create the user should successfully login the user
- entering anything else should throw an error
  - this error should be in a message that is useful to the user
  - re-typing in any field should clear the error
- clicking **Create a New Account** should switch to the new user panel
- clicking **Forgot My Password** should bring up a prompt to enter your email

### Post Login Content

- Opening the user panel should show the expected content as before
- Clicking the skier icon should open the adventure panel
  - There shouldn't be anything in the adventure panel but a **Add New Adventure** button
  - When clicking the **Add New Adventure** button a prompt should appear telling you to double click on the map
  - When double click on the map, a little icon should appear to highlight the point clicked and a form to be filled out should appear
  - all the fields should be able to be filled out and easy to reach
  - **Preview Save** should give a view of what the page would look like with the provided data
  - Clicking **Edit Adventure** should go back to the edit view
  - Clicking **Finish Saving** should give an alert somewhere that adventure was saved
- refreshing the page should persist the new adventure
- clicking on the icon should show the adventure as it was previewed before
- clicking and adding a new photo should add a new photo
- the photo should persist when reloading the page
- clicking the ellipsis next to the adventure name should allow you to edit the adventure
- editing the adventure and preview then finish should save the new data
- **cancel** from the edit view should return to the viewer view
- **Add to Ticklist** should add the adventure to the user ticklist
- On the adventure panel your name should've been added to a list of people who want to do the adventure
- Refreshing the page should persist this list and all other lists in the user panel as well
- Clicking on the user panel should show the new adventure under **Todo**
- Clicking on the adventure name should bring back up the adventure panel
- Clicking **Complete Activity** from the ellipsis menu should move the adventure from the **Todo List** to the Completed list
- Your name should also be removed from the list on the adventure panel
- Finally deleting the adventure should bring up a confirmation prompt
- Accepting the prompt should remove the adventure from the map and bring up an alert on the page
- Canceling from the prompt should return to the adventure viewer
- Different users should be able to be found by viewing the list under an adventure
- Clicking on the user should bring up their user panel
- You should not be able to add images to their profile
- There should be an ellipsis menu where you can friend that user
- If they've accepted you as a friend then you can message them (this behavior hasn't been built yet)
- When they've accepted you as a friend, you should get an email
- You shouldn't be able to see their friends, just their friend count (maybe)
- You can view their todo list and their completed activities
- Each item in those lists should bring up the adventure panel when clicked on
