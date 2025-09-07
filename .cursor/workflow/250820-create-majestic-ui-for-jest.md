# Majestic UI for Jest
- First let's forget everything about the previous interaction with majestic, and start fresh.
- majestic will only run with script for tests.
- Create TEST_USER and TEST_PASSWORD in the .env file.
- Configure majestic from the scratch.
- Configure base Auth for majestic, using the TEST_USER and TEST_PASSWORD.
- Configure UI to run and show log for tests.
- Make sure we are mapping the tests to the correct endpoints.
    - Try to create a dynamic mapping of endpoints in nestJS.

- Create Purge as standard for all services refered to entities with tenant_id.
    - This method is a permanent delete of the entity, and it's related entities.
    - It cannot be called at Controller level, it must be called at Service level.
    - Cannot be bound to public routes, dev routes will be created later on.
- Configure CASCADE on database context for entities with master detail relationships.

- Make sure on unit tests to purge records created by tests.
- Be careful with the order of the tests, to avoid foreign key constraints errors.
- Be careful with special routes that create more than one main entity, such as Business.

# Majestic logic and interface
- Configure majestic to run with script for tests.
- Configure an option to run all tests and options to run specific tests.
- Configure a Log screen to show the tests executing.
- Make sure to use as much as possible native majestic logic and interface.
- Minimize the amount of code in the script.
- The Auth is the basic browser AUTH.
- Make it pretty
- Make it visually possibel to see what tests went wrong.
- Make the console screen showing the test being executed colorful when needed (red for errors, green for success, yellow for warnings, blue for info, etc.)
