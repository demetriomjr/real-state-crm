# Fixes for tests.
- Make sure when trying tests that requires tenant_id, set and Guid empty in the JWT payload and/or request.
- For finallity of consistency, before running any test, reset database to erase all data.
- Fake terminal is still expanding when adding lines, make sure it is inside some form of container with max height and scroll bars.

# Second refactor for tests
- Let's refactor how tests work.
    - Business and master user are needed to follow up the remaining tests. Said so:
        1. Create Business and Master User.

        2. Run all tests possible.

        3.  At the end of the tests, purge the business and master user.
    - This way we can keep the database clean and avoid conflicts.
    - Make sure you do not add tenant_id to business logic or prisma schema.
        - if there is, remove it and fix it all.
    - Make sure the route Create for Business doesn't ask for tenant_id and user level. We are going to make it's rules later.
    - Create a TODO comment at business create controller to add confirmation to create user.
    - Size of Fake terminal is still off and not filling the remaining space.
    - Individual tests buttons are not working, make sure to check how we are working on the "rull all" one and follow the syntax on the others.
    - When tests run error or finishes, other buttons are not re-enabled.
    - When I scroll down to the footer, i still see a little bit of the beginning of the page.
    - Make the footer stick to the bottom of the page and never move.
    - Being practical, we can make the whole page fit in one vh by making the header and footer smaller, also reworking some sizes for other components.