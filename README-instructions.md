# 📘 README-instructions.md

## Instructions to Test Deployed Application

Go to live application:  
🔗 **https://fake-stack-overflow-hima-brijesh.onrender.com/**

> ℹ️ Test out the following **User Stories**, refer to scenarios defined in the acceptance criteria to figure out what to test:

- [Voting](https://github.com/CSE-316-Software-Development/final-project-hima-brijesh/issues/5)
- [Commenting](https://github.com/CSE-316-Software-Development/final-project-hima-brijesh/issues/4)
- [User Management](https://github.com/CSE-316-Software-Development/final-project-hima-brijesh/issues/2)
- [Pagination](https://github.com/CSE-316-Software-Development/final-project-hima-brijesh/issues/3)

## Instructions to run Jest test

1. **Clone the repository:**

   ```bash
   git clone https://github.com/CSE-316-Software-Development/final-project-hima-brijesh.git
   cd final-project-hima-brijesh

2. **Run Tests**:

    ```bash
    cd server
    npm install
    npm test
   ```
   
## Instructions to run Cypress test
1. **Clone the repository:**

   ```bash
   git clone https://github.com/CSE-316-Software-Development/final-project-hima-brijesh.git
   cd final-project-hima-brijesh

2. **Start server**:

    ```bash
    cd server
    npm install
    npm run build
    npm start
   ```
   
3. **Run Test**:
   ```bash
    cd client
    npm install
    npm start
    npx cypress run
   ```
   
- **NOTE: We have some flakiness in Cypress tests as some of them seem to be intermittently failing due to timeout errors.**  

## Instructions to generate the coverage report for jest tests.
1. **Generate Jest Report**:
   ```bash
    cd server
    npx jest --coverage
   ```

## Instructions to generate the CodeQL report for your application's server

1. Download the [Code QL bundle](https://github.com/github/codeql-action/releases/tag/codeql-bundle-v2.19.3) for your operating system.

2. Extract the archive to a directory of your choosing. Let's call this directory `<extraction-root>`

3. Verify the installation by running the following command:

   `$ <extraction-root>/codeql/codelql resolve packs`

   If the installation was succesful, in the output for the above command you should be able to see the path to the ql packs for javascript. The location should be within the extracted CodeQL CLI bundle in the directory `<extraction-root>`. If the CodeQL CLI is unable to locate the qlpacks for the expected languages, check that you downloaded the CodeQL bundle and not a standalone copy of the CodeQL CLI.

3. **Run the following commands from the server directory**:

   `$ <extract-root>/codeql/codeql database create <database> --language=javascript-typescript`

   `<database>` is the path to the directory of your choosing where you want the CodeQL database of your source code to be stored.

4. Analyze the code and generate report using the following command:

   `$ ~/codeql/codeql database analyze <path/to/codeql-database> --format="sarif-latest" --output <path/to/report/report.sarif>`

## You can refer to existing report files
- Go to server `Reports.zip` and extract.
- It has two directories: `coverage` containging coverage report and `CodeQL Report` containing `report.sarif`

## Instructions to set environment variables that one may need to run any scripts or tests.
- None required, all environment variables are taken care by the start scripts.

    
