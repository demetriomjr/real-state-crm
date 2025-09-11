# JWT logic
- When authenticating, we always send back the JWT with the tenant_id inside. Alongside we send a userSecret.
- This userSecret generated and stored in cache in backend side. We use this to make sure we can say for sure that the user using the JWT is the same that authenticated.
- At middleware, we use the userSecret to make sure the user using that token is indeed the same that authenticated. We also use it to find user data we need to authorize the request.
- user_leve is one of them. There is a logic to ganrantee the user has clearance to do an action by role and level.
- The frontend doesn't know any of that.
- Everytime we make a call to backend, we need to send both userSecret and JWT in header.
*** IMPORTANT: Make sure we are caching the userSecret/user_id properly in backend side. ***
* You can use a hardcoded array of {userSecret: string, user_id: string} to test the logic. Use typescript type for this.
- Make sure middleware is uptodate with all available userlevels.


# Register page
- Once registered successfully, we also authenticate the user. I believe the logic to POST bussiness already does that.
- Store them properly in localStorage. Also make sure we are receiving the date of expiration of the JWT.

# Business endpoints and logic
*** IMPORTANT: Check carefully all dtos and current rules to validate them in the frontend code. ***
* Make sure all set routes for business are working.
* POST business must be a public route. Make sure middleware knows that.
* Also, login route must be a public route. Make sure middleware knows that.
