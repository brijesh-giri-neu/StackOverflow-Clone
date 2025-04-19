This file contains additional context and implementation notes for the grader.

---

## JEST Coverage Explanation: Why Below is Not Covered by JEST

### 1. `server.ts`
In `server.ts`, the block that starts the server and connects to the database is conditionally executed only if `process.env.NODE_ENV !== "test"`:

```ts
if (process.env.NODE_ENV !== "test") {
  // code
}
```

Jest tests set NODE_ENV to "test" to avoid starting the actual server and connecting to a real MongoDB instance. This ensures tests are isolated and fast, but it means this block will never be covered in test environments

### 2. Mongoose Pre-save Hook in user.ts
We define a pre-save hook to hash user passwords only when a user document is being persisted to the database:

```
userSchema.pre("save", async function (next) { ... });
```
In tests, user creation is mocked using static methods like User.registerUser and the underlying .save() method is not triggered on a real Mongoose instance. Hence, the hook does not run, and the associated logic remains uncovered by Jest.

## Why CodeQL Vulnerabilities are False Positives

We ran a CodeQL analysis and reviewed flagged issues. Below are explanations for the false positives:

1. SQL Injection
   We are sanitizing user-input by escaping any JavaScript or NoSQL code to protect against No-SQL injection using our custom inputSanitizer middleware. However, the static analyzer fails to detect this, as the actual sanitization logic is wrapped in packages used by our application: 'express-mongo-sanitize' and 'xss' 

2. Rate Limiting
   The report flags the absence of rate limiting. However, this has been implemented on Voting feature using rate-limiter middleware.

3. CSRF
   CodeQL assumes potential CSRF due to session-based authentication. However:
   - We use SameSite=Strict depending on env on cookies to mitigate CSRF vectors

4. Regex Denial of Service (ReDoS)
   We are sanitizing user-input by escaping any special characters to protect against this using our custom inputSanitizer middleware. However, the static analyzer fails to detect this.

## CI/CD Workflow (GitHub Actions)

### CI on All Branches
Each push or pull request on main runs:
- npm install and lint check
- Jest unit tests
- Cypress tests

### Deploy Branch
- Pushing to the deploy branch triggers a production release on Render.

- The code gets deployed to the following link:
🔗 **https://fake-stack-overflow-hima-brijesh.onrender.com/**
