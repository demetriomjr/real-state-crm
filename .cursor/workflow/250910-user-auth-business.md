#Business register and entities
- Revert business entity to the previous one. Remove "domain" field.
    - Phone and email continue, but they are not mandatory anymore. Make sure to check the logic in the backend and frontend to handle this.
    - In the backend, if phone or email is empty, we don't create a contact for that.

#Auth logic
- Username is now unique in register and database table, the model username@domain no longer exists. remove all about that.
- Make username field case insensitive in login. In register, make sure to lowercase the username before sending it to the backend.

# Implementations
- Make sure that each change affects the whole flow of classes and components. Also prisma schemas and migrations.
- Wipe any data in database so we start fresh.
- run eslint to check for errors.
- build local first to check for errors.
- after that, if all good, docker build and push to docker hub.

# Register page
- We still have some html errors in the register page. 
- phone country and phone number inputs are not in the same height. To fix that make sure they are inside a container in "row" mode, and that they hight is set to 100%. that will make them dynamic. Use any css logic you know will work for this.
- We have 2 footers for whatever reason, i think you created the footer outside the pages as i requested previously, but didn't really removed them from the pages. Let's make that better. Footer should be fixed outside the page container.
- No vertical scrollbar is showing when i zoom the page. See what is going on with that.