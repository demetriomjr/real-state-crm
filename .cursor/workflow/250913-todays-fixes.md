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