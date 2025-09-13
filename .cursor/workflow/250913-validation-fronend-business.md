# Data lists
- Add documents validations based on known logic about document types in frontend.
- Add formatters to the document types in frontend. The same way we did for phone numbers.
    - You there are, you can hook APIs that do that. If they exists.
- Add the Zip code validation and formatter. In brazil we have public APIs that search an address by zip code. For now just add for brazil.
- Make sure to just give a red border with some message below about the problem, and that we can't save if there's some invalid information while creating or updating any of the lists data.

# Responsiveness
- Make sure some umnecessary labels are not loaded on mobile ports.
    - A good example is a label that exists at left of "add contact button". It's not needed in mobile ports.
    - All 3 lists in business have a label like that and can be left out in mobile ports.
- Since we set fixed hight to footer, it doesnt scale properly in mobile ports. create a logic where the height is auto, but always stays at the minimal necessary height, as long it respects the padding. That way when text wraps in mobile ports, the container of it expands to fit it.

*** IMPORTANT: BE CAREFUL WITH ALL OF THIS CHANGES. YOU NEED TO REFLECT IN EVERY DECISION YOU MAKE AND MAKE SURE NOT TO CREATE DESIGN ISSUES ***]

* Implement all changes
* run eslint to check for errors.
* build and compose the altered containers.