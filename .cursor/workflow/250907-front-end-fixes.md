1. Login screen
- Center the login container.
- Change this white pallet to a more realistic one. Use pleasant colors to build up a new pallet. We are going to revisit this later.

2. Language support
- Use i18n for language support.
- The base language is ptBR.
- The App name is FlexSuite CRM para imobiliárias.
    - Make sure to set all that in the client side.
- Correct all texts that includes mentions of the suport
- The developer's name is Demetrio M. Jr. Make sure to add it to the footer in a really cool way.
* Build and run it at docker.~

3. API consumption
* Seems like the post method is calling USERS instead of Bussiness. Read all logic in backend about business and master user and implement it correctly in the register page.
* Make sure to use the correct API endpoints.
* Build and run it at docker.

4. Register page and auth logic
- Once registered, it's redirecting to the login page. Make sure to redirect to the home page using the authed data.
- Make sure to feedback the user using a toast message instead of a simple alert inside the container. This is an important feedback and needs to be visible to the user.
- Add "eye" buttons inside password fields to show/hide the password.
- Create a splash loading component to be used in restful api calls.
- Also use that component when navigating in the whole app.
- Make this compoent with some opacity, a greyish background and a loading spinner inside.

5. Auth logic
- POST business is working, but the navitagion is still redirecting to the login page. Make sure to redirect to the home page using the authed data. Make sure we are storing the auth data properly in the localStorage.
- Make sure the app reads localStorage and uses the auth data to navigate the app. The missing of any of those should redirect to the login page. Also when it happens, notify the user using a toast message.
- The account creating toast is cool, but i wondered something more loud, that pops in the middle of the screen and waits user confirmation to close it.
- Make sure we are not allowing repeat usernames, since they are a unique key to login. Edit anything you need in the prisma schema, code logic in the backend, and make a async call to tell the front end that the username is already in use.

6. Login and home page
- Whe loggin it says success but no redirecting to the home page. check if we are storing the auth data properly in the localStorage.
- The home page initially looks great. but lets improve the color pallet of it. try this values as pallet:
```
#A59D84
#C1BAA1
#D7D3BF
#ECEBDE
rgb(165, 157, 132)
rgb(193, 186, 161)
rgb(215, 211, 191)
rgb(236, 235, 222)
```
- Round some corners very slightly.
- Use an avatar svg in the user options. Make sure we are showing user's name in the header, not username.
- Improve a little the good lookings of the home page by using very popular websites homepage as references.

7. public pages bg and color pallets alteration of usage.
- Our color pallet is still a little stiff. Lets improve it by using more subtle colors. The placement of the color is still off as well. The white in the cards are not really cool. the variation of tone between forward components and background is too far away. Lets create more inbetween colors to make it more subtle.
- The Recent Activities and Quick Actions cards are too dark and not following the logic of color placement as the cards above.
- Remove the whiter color from our pallet for a more darker tone. it's rgb can still be around 200.
- Do not use Green in this brown pallet, instead use a really dark tone of brown.
- For icons you can be creative with colors for contrast, but they need to work well with this brownish pallet.
- Use our new color pallet to generate a gradient background for the public pages.
- Use the darker colors as border for inputs and texts as well and buttons, using variations in color to suite better.
- Business is not a option in this menu. Instead use a "My business" option that will load the ownser business data in the future.
- Allign Settings and My business to the bottom.
- Use a darker tone to the item in the menu that is the current page. Blue with brown is not really cool. make the hover effect just a little bit darker.

8. Data consistency and more
- When we restar the server, our cached userSecrets are lost, and if a page is still opened in the users browser, it will had some old data. Because of that we need to make sur that, when we request something in server that is not a public route, we check if the user secrets exists. in case it does not, we redirect to the login page.
- Make any text that isn't user data unselectable. That goes all the way for the whole app. Make sure to keep selectable data the user might need, such as input fields, table rows and etc.
- The bottom cards in home page are still too dark. Use the same logic as the other cards above.
- The footer is to high and it's not fixed. Make sure it fits in viewport.
- The sidebar doesn't need to desappear in desktop. You can keep it thin when collapsed, only showing the icons.
- Do not round corner that touches the viewport edges. Fix the main container and sidebar containers. sidebar is showing a horizontal scrollbar.
- The main app container or any one that wraps everything is not adapting the viewport height and width properly. Fix it.

9. Layout mistakes
- The footer is not fixed. It has some wierd margin, or the parent container has padding, eitherway check it and fix it please.
- Sidebar is still showing a horizontal scrollbar. Make sure the widht is dynamically adjusted to the parent component.
- When collapsed, the sidebar is hiding in the desktop, but i can see the shrinking effect working. Just make sure that if we are on desktop it stays shown. Be carefull to not break it in the mobile view.
- Some weird behaviors happens with the Recent Activities and Quick Actions cards. They are back in the layout and their content is not set inside.
- Reanalyse these components and make sure they are working as expected.
- Do not show a "selected" border in any component i clicked last.

10. Home page and more
- In header, close to the user options, some container still has rounded corners. Fix it. Seems like the whole header is still rounded corner.
- footer is too tall. make it about 10px smaller.
- Recent Activities card shows 2 types of data about being empty. jst keep the "your activities will appear here" text.
- Both borrom cards are still in the back of the layout. Make sure they are in the same level of the top cards.
- Make sure the home page data fits and adapts to viewport remaining space. there's no need for scrollbars in the page since it shows static elements.
- Change the card "Business Units" to "Orders and Offers" that will be implemented in the future. Make sure to correct the icon.
- Use a darker tone in the header, footer and sidebar bgs.
- Use a darker bg tone in login and register pages.

11. Improvements in general
- The 4 top cards have broke. their content is not adapting to resizement aparently. Fix it in the simpliest way possible.
- Create a hover in the two bottom cards because thei are still being overlapped by their content.
- Use a gradient background for the content container that holds the home page. It should hold the same color while navigating to other pages.
- Make sure the welcome message is more visible, it's fadding with this dark background. Use the gradient properties to make it more visible.
- You can use a linear gradient with a vertical axis to improve the text in the top above the cards.
- Reanalyse all components to make sure everything in this page can adapt to resizement.

12. Welcome text and some borders
- Rework the welcome text element, to be marginless and fixed at the top of content container.
    - Use an inverted gradient to make it more visible.
- Sidebar has a little border that is not really cool. remove the border completely.
- The footer desappeared.