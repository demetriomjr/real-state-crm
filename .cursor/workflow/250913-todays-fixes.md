1. Business page and backend ecosystem
- Lets change a little of the logic about contacts.
    - Remove Whatsapp from the contact types. Now if a contact is either linenumber or cellphone, it will have an option to toggle if is whatsapp.
    - In the backend whatsapp will be a boolean field. Make sure to remove the options for type as well, in both frontend and backend.
    - In frontend, make sure that, when type is selected, the button to toggle whatsapp is only shown if the type is cellphone or linenumber.
- Add logic to validate the remaining contact types. Search for ways to validate email using javascript, and make sure we are validating phone and cellphone using country logic. We have done some of that in Register page.
- Make sure we also format phone and cellphone using spacing and dashes, based on the country.
- Add a contact_name field in all the flow of the logic. I mean all, from prisma schemas up to the frontend, do not forget any file of the flow.


2. Business page width and reponsiveness
- Remove an margin left and right of any paper component in the business page or its components.
- Remove any padding from the boxes wrapping any component in the business data.
- Remove any margin from the box wrapping the paper or component about the edit panel buttons. we are going to control that using width and scales.
- For width, we are going to set a maxWidth for the data wrapper and the paper button panel of 1200px. they should up to it in desktop ports, and scale down to 100% in mobile ports.
** make a backup of everything before making any changes.
- Then you can lint for errors and docker build up -d

3.
- In contacts in fronend, in the modal, the input is placeholding "Value of contact". this is a technical term, and do not reflect user's notion of it. Just use "E-mail of contact", "Phone of contact", "Cellphone of contact" accordingly.
add some padding top to the modal we are using to edit the lists for business, about 10px in scale value.

4.
- We have broken the logged user response that sets the user data in the localStorage. user's name is not being shown. check the authorization loggin logic and make that when we login, we brin the user's person table data's full_name. because we changed how user saves it's name, we need to correct that in the response to authorization and authentication. Check anywhere where user data is gathered from database to make sure we are loading any pertinent data from person table. Remember person is a fragment here, and it's data is embedded in the DTO along with the user table data. At frontend level we don't know the existence of person table.
- Make sure to reanalyze all user logic based on the description above.

5.
- In the App level, user's full_name is not being loaded to the label besides the user avatar.
- The my data page is not with all inputs. i don't see user's full name, or addresses, contacts and documents.
- When i said about a user not being able to edits it's own roles, i forgot to mention that the user can see them in the page. Only editing actions are not included in the page.
- Regather the lists logic from business page and make sure they are in the template md. We are going to review the page template while we add what is missing.
- Implement user login log full logic in the schema of tables, domain, user services repo. and the frontend logic.
- We are goint to have a grid table compoent at the bottom of the pile with the last login records from that user.
- be careful to implement this, the system is complex when you can't miss any file from the backend to the frontend.
- These logs are registered in the backend in the login route, but the JWT token is ignored.
- Now on the user level in the frontend my data page, no text is loading in the combobox input. make sure we have their names in backend. i believe we commented them somewhere in there. Use that to make i18n implementations.
- Make the button alter passowrd red.

6.
when my business' or user's page are saved successfully, update the user full_name in localstore to garantee that the user's name is always up to date.
- we are missing a lot of i18n tags in the user edit page.
- add a date filter to the login logs grid table.
- move this grid table to inside the scrollable area of the page.
- can't really click inside the browser when loaded the page, is ther any component preventing it?

7. edit-page fixes
<div aria-hidden="true" class="MuiBackdrop-root css-1u4ia3k" style="opacity: 1; transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1);"><div class="MuiBox-root css-5uxyq9"><span class="MuiCircularProgress-root MuiCircularProgress-indeterminate MuiCircularProgress-colorPrimary css-1szjt7g" role="progressbar" style="width: 60px; height: 60px;"><svg class="MuiCircularProgress-svg css-4ejps8" viewBox="22 22 44 44"><circle class="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate css-13odlrs" cx="44" cy="44" r="20" fill="none" stroke-width="4"></circle></svg></span><div class="MuiBox-root css-mkuyib">Carregando dados do usuário...</div></div></div>
This element is covering the page, its a spinner that is not disappearing after the page is loaded. fix it.
- you haven't moved the card of "logs" inside the scrollable area of the page. move it there.
- The functions in this page is supposed to be the user_roles? because if so, instead of having that inside the Status card, create an "alter roles" button stacked under the alter password button.
    - When editing this page via the logged user, this button must be disabled.
- Remove ip address and reason from the columns, split date and time into 2 columns,
- trying to load i18n login history header table returns key 'user.loginHistory (ptBR)' returned an object instead of string.
- the mask inside contacts for phone is wrong, in brazil culture it's (##) #####-####, not (###) ###-#####.
* Fix those, lint for compiler errors and build.

8. response dtos refactor
* CONSIDERATIOS: don't use objects nested inside dtos.
                 person table is a fragment and it's pertinent fields must be embedded in the DTO.
                 passwords never come back from the database.
                 foreign keys such as person_id or tenant_id should not be returned in the DTOs.
                 DO NOT create similar dtos for the same entity, just because of different HTTP methods. if they are similar, use the same DTO.
*
Refactor below DTOS under reflections on *** CONSIDERATIONS ABOVE ***
- UserResponseDTO
- Business responses DTO have different classes but they should have the same structure. see why there are two.
- Lead responses have person fields, so we should use the fragmentation technique to salve those fields. that includes lists as well.
- Same above for customer responses.
- I like the fact chat response does not return contact_id, but make sure that in repository contact exists inside person table as a contact object in the relation table.
    - The scaffolding should be something like: ChatResponseDTO <== [Chat table + person table + contact table] (this is just an example of the relationship.)
- sensitive data in whatsappsession dto in regards of *** CONSIDERATIONS ABOVE ***
- sensitive data in user login log response dto in regards of *** CONSIDERATIONS ABOVE ***
- In passwordchangeresponseedto, instead of just relying on message to know about success, also add a status as int, using http common status codes.
    - Also add the logic to identify this in the frontend.
** Refactor all of those, lint for errors and build.