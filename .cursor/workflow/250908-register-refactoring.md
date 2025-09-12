# Business data
- In person entity, we can create contacts.
- When registering a business in the frontend, ask for email and phone number.
    - This will be created as contacts in the person entity.
- Create the field "domain" in the business entity. it's a string that can only contain letters and numbers. No spaces. has between 6-16 characters.
- Make sure we are setting this domain at register page.
- remove any static field in person that suggests documents and contact types. we are only dealing with contacts in the detail table now.
- Make sure we always set the first contact, document or address of a person as primary/default(whatever we chose to name it).
- Make sure that on update, we can change the primary/default contact, document or address by sending a register with the field "default" as true. When that happens, we need to set the other ones as false. Only one registry can be default at a time.
- Make sure to create the default field in all the pertinent dtos as nullables.
- In contacts, we can have multiple default since they are different types. The current types are explicitly defined in the contact.validator.ts file.
- Create the new components in the register page to suit the new fields and logic.

# User routes and auth.
- In user auth, now we can use the logic as ${username}@${domain}, ex. demetrio@edaimond. This way we can create room for diferent people from different tentans with the same name, to keep simple usernames.
- In the backend, We get the list of how mane "demetrio" exists in users, then we search for a bussines with "edaimond" as domain. This way we are sure to be calling the correct user to auth.
- Make all of this case insensitive.
- In frontend make sure we can only type letters and numbers in the username field. No spaces.
- Make sure to respond correctly if the domain does not exists, or if the domains exists, you need to say something like "this username does not exists in this domain. Please try again."
- Make sure to check username uniqueness by domain and not overall.

# My business form
- Create and implement the form to update the business. Follow rules from the Update DTO in backend.
    - You can use the nullability of the fields in the DTO to know which fields are optional.
    - Set a formal "not null" validation in the frontend to prevent non null data.
- Follow the same standards to shape and format the css for this form using reference the create business page. all standards you used there can be used as reference.
- Remember that GET /businesses/:id brings data from diferent tables, such as person and contacts. We need to keep integrity making sure these data is not being updated empty and the ID is consistent. We don't track detail tables IDs in frontend. This is a job for the Business service.
- In frontend, the data comes as a whole in one dto, the business service will handle the data distribution to the diferent tables. Make sure we always bring the main data used in the register time.
- Make sure we can validate some REGEX at front end, such as email and phone number formats. Also we need to set patterns for human names.
- Create via i18n confingurations, maskes for phone numbers for the current contries we have set. Use this masks in the input for phone number in this form.
- Implement the page and hook it up in the sidebar menu.

# Component reusability
- This is a good momento to train components reusability.
- The bottom panel with save and cancel buttons is a good candidate for this.
- The header and the form's container too. We are going to be following the same layout for any "edit" form. Create in this one a model that can be adapted to use in different entities. Use react functionalities to make this possible.