# Business page refinement
- Remove some labels inside the "tabs" like "Manage contacts", "Manage documents", "Manage addresses". Remove the i18n tags as well.
- Correct phone formatting masks using country. add the "whatsapp" tag in the view cards next the the default tag.
- Do not show country id in the phone mask.
- Addresses needs number input. Add a number input all the way from prisma schemas up to the frontend. do not forget any level of the logic.
- Put the input for number next to "street" input.
- Make state a max 2 letters long. make the input smaller in width as necessary. force capitalize it. only accept letters.
- put is_default toggle button next to country input.
- Make a logic both in backend and frontend to only have a max of 10 itens in every list in business.

# Template for future UIs
* From the business page, gather all the information to create a template for Edit pages in the future.
    - Anything about the layout, types of components, the edit buttons panel implementation and usage.
    - The i18n standads, validation logic contruction, list constructions, modals to edit list items.
* Create the instructions in /.cursor/rules/editpage-template.md and make sure you are loading it with the rest of the rules.

# Edit page for the logged user.
- Remove user full_name from the user domain and prisma schema.
- We are going to bind user to the person entity. Following the same logic as business entity, now user will have a person_id field. In the case of business and its master user, the same person will be used. which means the persons data will be editable in both routes.
    - Make sure to edit all the flow, don't forget to update DTOs, services, repositories, etc.
    - Following the same logic, we can edit person's lists, like contacts, documents, addresses and etc, in this page as well. You can crate a logic to reuse the same components and modals to edit the lists used in business page.
    - Make sure to learn how we add and delete items from list using the code in the backend.
    - Different from business page and routes, no audit field other than id will be returned in the API, or accepted as a parameter.
    - tenant_id is also a sensitive data and not accepted as a parameter. rememver that!
    - To edit password, we will need to make sure to ask the current password and the new password twice (confirm password). When loading any table with "password" fields, we never respond the object with the password. Password is sensitive data and should not be returned in the API.
    - The password inputs will not appear in the main page, only in the modal.
    - To update the password, we will use a modal, where we type the current and the new password as described above.
    - What will happen in this modal is: When clicking confirm button on the modal, we will consume an api route that tells us the authorization for the password change, based on the current password verification. This API route will return the new password already encrypted for safety measures.
        *** IMPORANT: make sure that we rework all the logic in backend to fit this new logic. we are going to pass the hashed new password as "password" field in the DTO. This means we don't need to hash it when it comes in the update route.***
    - Confirming the modal doesn't update anything in the database. The function of this route is only confirm the current password, confirm that the new password follows the requirements, and that the both new passwords match. All of that met, it returns the new password already encrypted for safety measures.
    - The response DTO for both create and update routes will be the same.
- Use the new template and build the edit page for the logged user. This page will be also used to edit "any user" later by the master user. In order to make sure we are not messing up what the page must show based in case of use, you can create the full logic based on user data from backend.
- What is goind to dictate what information will be shown is the follow:
    - A user cannot edit his own user level
    - A user cannot edit his own roles
    - A user cannot edit his own username for now.
- Based on the template, create the edit page for the logged user.
    - Make sure to create the page based on the fact the user_level following principles described above.
    - Confirming a user edit is succesfull, generates a new authentication data, following the loggin route.
    = Make sure to update backend cache for logged user and the localStore for the logged user.
- Bind the route to the header user menu.
- Confirming or canceeling navigates back to home in this frontend route.

* research the code before planning.
* plan careffully every step of the way.
* implement all changes
* eslint for errors
* docker build up -d both containers, and dont forget prisma migrations.

$ FEEL FREE TO ASK ME FOR CLARIFICATIONS BEFORE WORKING.
