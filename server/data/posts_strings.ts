const Q1_DESC = "Programmatically navigate using React router";
const Q1_TXT =
  "the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.";

const Q2_DESC =
  "android studio save string shared preference, start activity and load the saved string";
const Q2_TXT =
  "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.";

const Q3_DESC = "Object storage for a web application";
const Q3_TXT =
  "I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.";

const Q4_DESC = "Quick question about storage on android";
const Q4_TXT =
  "I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains";

const A1_TXT =
  "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.";
const A2_TXT =
  "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.";
const A3_TXT =
  "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.";
const A4_TXT =
  "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);";
const A5_TXT =
  "I just found all the above examples just too confusing, so I wrote my own.";
const A6_TXT = "Storing content as BLOBs in databases.";
const A7_TXT = "Using GridFS to chunk and store content.";
const A8_TXT = "Store data in a SQLLite database.";

const Q5_DESC = "How to handle async operations in JavaScript?";
const Q5_TXT =
  "I'm working on a Node.js application and I need to make multiple API calls sequentially. Each call depends on the result of the previous one. What's the best way to handle this? I've tried using callbacks but it's getting messy with nested callbacks. Should I use Promises or async/await?";

const Q6_DESC = "Python list comprehension vs for loop performance";
const Q6_TXT =
  "I'm processing a large dataset in Python and I'm wondering if list comprehensions are faster than traditional for loops. I've heard mixed opinions. Can someone explain the performance differences and when to use each approach?";

const Q7_DESC = "CSS flexbox not centering items properly";
const Q7_TXT =
  "I'm trying to center a div both horizontally and vertically using flexbox, but it's not working as expected. I've set display: flex, justify-content: center, and align-items: center on the parent container, but the child element is still not centered. What am I missing?";

const Q8_DESC = "SQL JOIN query returning duplicate rows";
const Q8_TXT =
  "I'm joining two tables and getting duplicate rows in my result set. The tables have a one-to-many relationship. How can I prevent duplicates or handle them properly? Should I use DISTINCT or GROUP BY?";

const Q9_DESC = "TypeScript type errors with React props";
const Q9_TXT =
  "I'm getting TypeScript errors when passing props to my React component. The error says 'Property does not exist on type'. I've defined an interface for my props, but TypeScript still complains. What's the correct way to type React component props?";

const Q10_DESC = "Docker container keeps restarting";
const Q10_TXT =
  "My Docker container keeps restarting immediately after it starts. I've checked the logs but they don't show any obvious errors. The container runs fine locally. What could be causing this issue and how can I debug it?";

const Q11_DESC = "Git merge conflict resolution strategy";
const Q11_TXT =
  "I'm working on a team project and we're frequently getting merge conflicts. What's the best strategy to minimize conflicts? Should we use rebase instead of merge? How do we handle conflicts when multiple people are working on the same file?";

const Q12_DESC = "REST API authentication best practices";
const Q12_TXT =
  "I'm building a REST API and need to implement authentication. Should I use JWT tokens, session-based auth, or OAuth? What are the security considerations for each approach? How should I handle token refresh and expiration?";

const A9_TXT =
  "For sequential async operations, I'd recommend using async/await as it's more readable and easier to debug. Here's an example: async function fetchData() { const result1 = await apiCall1(); const result2 = await apiCall2(result1); return await apiCall3(result2); } This avoids callback hell and makes error handling cleaner with try/catch blocks.";

const A10_TXT =
  "You can also use Promise chaining if you prefer: apiCall1().then(result1 => apiCall2(result1)).then(result2 => apiCall3(result2)).catch(error => console.error(error)); Both approaches work, but async/await is generally preferred for readability.";

const A11_TXT =
  "List comprehensions are generally faster than for loops because they're optimized at the C level in Python. However, the performance difference is usually negligible unless you're processing millions of items. Use list comprehensions when the logic is simple and readable, and for loops when you need more complex control flow or side effects.";

const A12_TXT =
  "For very large datasets, consider using generator expressions instead of list comprehensions to save memory: (x*2 for x in range(1000000)) instead of [x*2 for x in range(1000000)]. This creates an iterator instead of a full list in memory.";

const A13_TXT =
  "Make sure the parent container has a defined height. If the parent's height is auto or not set, align-items: center won't work as expected. Try setting min-height: 100vh or a specific height value. Also check if there are any conflicting CSS rules or if the child element has margin: auto which might interfere.";

const A14_TXT =
  "You might also want to check if the parent container is actually taking up space. Add a background color temporarily to visualize the container bounds. Sometimes the issue is that the container itself isn't positioned correctly.";

const A15_TXT =
  "The duplicates are likely because of the one-to-many relationship. If you only need one row per parent record, use DISTINCT ON (PostgreSQL) or GROUP BY with aggregate functions. If you need all related records, the duplicates are expected behavior. Consider if you really need all columns from both tables or if you can restructure your query.";

const A16_TXT =
  "You can also use window functions like ROW_NUMBER() to get only the first related record: SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY parent_id ORDER BY created_at) as rn FROM joined_table) WHERE rn = 1;";

const A17_TXT =
  "Make sure you're exporting the interface and importing it correctly in your component file. The component should be defined like this: interface Props { name: string; age: number; } const MyComponent: React.FC<Props> = ({ name, age }) => { ... }; If using functional components, React.FC<Props> ensures proper typing.";

const A18_TXT =
  "Also check that you're not mixing up props and state. If you're using useState, make sure the state type matches. Sometimes the error occurs because TypeScript can't infer the type correctly, so explicitly typing helps: const [value, setValue] = useState<string>('');";

const A19_TXT =
  "Check the container exit code with: docker ps -a. Look for the exit code - if it's 0, the container completed successfully (which might be the issue if it's a one-time script). If it's non-zero, check the logs more carefully: docker logs <container_id>. Also verify the CMD or ENTRYPOINT in your Dockerfile is correct.";

const A20_TXT =
  "Common causes include: the main process exiting immediately, missing environment variables, incorrect file permissions, or the application crashing on startup. Try running the container interactively: docker run -it <image> /bin/bash to debug inside the container. Check if all dependencies are installed and paths are correct.";

const A21_TXT =
  "Use feature branches and pull requests. Keep branches small and merge frequently. Before merging, always pull the latest changes and resolve conflicts locally. Consider using git pull --rebase to keep a linear history. For the same file, coordinate with your team or use file-level locking if your workflow supports it.";

const A22_TXT =
  "When conflicts occur, communicate with your team. Use git merge-tool for visual conflict resolution. After resolving, test thoroughly before pushing. Consider setting up pre-commit hooks to run tests and ensure code quality. Some teams use merge strategies like 'ours' or 'theirs' for specific files, but be careful with this approach.";

const A23_TXT =
  "JWT tokens are stateless and work well for distributed systems. Store them in httpOnly cookies for security (prevents XSS attacks). Implement refresh tokens for long-lived sessions. For session-based auth, use secure, httpOnly cookies and consider Redis for session storage in distributed systems. OAuth is best for third-party authentication.";

const A24_TXT =
  "Always use HTTPS in production. Set appropriate token expiration times (short for access tokens, longer for refresh tokens). Implement rate limiting to prevent brute force attacks. Validate and sanitize all inputs. Consider using libraries like Passport.js for Node.js which handles many security concerns out of the box.";

export {
  Q1_DESC,
  Q1_TXT,
  Q2_DESC,
  Q2_TXT,
  Q3_DESC,
  Q3_TXT,
  Q4_DESC,
  Q4_TXT,
  Q5_DESC,
  Q5_TXT,
  Q6_DESC,
  Q6_TXT,
  Q7_DESC,
  Q7_TXT,
  Q8_DESC,
  Q8_TXT,
  Q9_DESC,
  Q9_TXT,
  Q10_DESC,
  Q10_TXT,
  Q11_DESC,
  Q11_TXT,
  Q12_DESC,
  Q12_TXT,
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
  A9_TXT,
  A10_TXT,
  A11_TXT,
  A12_TXT,
  A13_TXT,
  A14_TXT,
  A15_TXT,
  A16_TXT,
  A17_TXT,
  A18_TXT,
  A19_TXT,
  A20_TXT,
  A21_TXT,
  A22_TXT,
  A23_TXT,
  A24_TXT,
};
