# Job Portal - Selenium & Maven Tests

This directory contains automated tests for the Job Portal application using Selenium, Maven, and REST Assured.

## Project Structure

```
.
├── pom.xml                          # Maven configuration with dependencies
├── src/
│   └── test/
│       └── java/
│           └── com/
│               └── jobportal/
│                   └── tests/
│                       ├── api/
│                       │   ├── RegisterUserTest.java
│                       │   └── GetAllJobsTest.java
│                       └── utils/
│                           └── ApiTestUtils.java
└── README.md                        # This file
```

## Prerequisites

Before running the tests, ensure you have:

1. **Java Development Kit (JDK)**: Version 11 or higher
   - Install from [oracle.com](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html) or use `brew install openjdk@11` on macOS

2. **Maven**: Version 3.6 or higher
   - Install from [maven.apache.org](https://maven.apache.org/install.html) or use `brew install maven` on macOS

3. **Node.js**: For running the Job Portal backend and frontend
   - Verify installation: `node --version` and `npm --version`

4. **MongoDB**: Running locally or accessible
   - Default connection: `mongodb://localhost:27017/job-portal`

## Installation & Setup

### 1. Verify Maven and Java Installation

```bash
java -version
mvn --version
```

### 2. Navigate to Project Root

```bash
cd /Users/piyushkumarsingh/Desktop/Job\ Protal\ copy
```

### 3. Download Dependencies

Maven will automatically download all dependencies from `pom.xml` when you run tests. To pre-download:

```bash
mvn clean install
```

## Starting the Application

Before running tests, start the backend and frontend servers:

### Terminal 1 - Start Backend Server

```bash
cd server
npm install  # Only needed first time
PORT=5001 node server.js
```

The server should be running on `http://localhost:5001`

### Terminal 2 - Start Frontend (Optional for UI tests)

```bash
cd client
npm install  # Only needed first time
npm start
```

The frontend will be running on `http://localhost:3000`

## Running Tests

### Run All Tests

```bash
mvn clean test
```

### Run Specific Test Class

```bash
# Test Register User API
mvn test -Dtest=RegisterUserTest

# Test Get All Jobs API
mvn test -Dtest=GetAllJobsTest
```

### Run Specific Test Method

```bash
# Test successful job seeker registration
mvn test -Dtest=RegisterUserTest#testRegisterUserAsJobSeeker

# Test duplicate email registration
mvn test -Dtest=RegisterUserTest#testRegisterDuplicateEmail

# Test get all jobs
mvn test -Dtest=GetAllJobsTest#testGetAllJobsSuccess
```

### Run Tests with Output

```bash
mvn test -X  # Very verbose output
mvn test -e  # Show error messages
```

## Test Coverage

### Register User API Tests (`RegisterUserTest.java`)

1. **testRegisterUserAsJobSeeker**: Validates successful registration as a job seeker
   - Expected: 201 status, JWT token returned, user details correct

2. **testRegisterUserAsEmployer**: Validates successful registration as an employer
   - Expected: 201 status, JWT token returned, user details correct

3. **testRegisterDuplicateEmail**: Validates duplicate email handling
   - Expected: 400 status, error message about existing user

4. **testRegisterWithMissingFields**: Validates missing required fields
   - Expected: 400 or 500 status

5. **testRegisterWithInvalidEmail**: Validates invalid email format
   - Expected: 400 or 500 status

### Get All Jobs API Tests (`GetAllJobsTest.java`)

1. **testGetAllJobsSuccess**: Validates successful jobs retrieval
   - Expected: 200 status, response body not null

2. **testGetAllJobsReturnsArray**: Validates response is a list
   - Expected: 200 status, response is an array

3. **testJobResponseContainsRequiredFields**: Validates job objects have required fields
   - Expected: Jobs contain _id, title, description, location

4. **testGetAllJobsResponseHeaders**: Validates response headers
   - Expected: Content-Type is application/json

5. **testGetSingleJobById**: Validates retrieval of single job by ID
   - Expected: 200 status, correct job returned

6. **testGetJobWithInvalidId**: Validates invalid job ID handling
   - Expected: 404 or 500 status

7. **testGetAllJobsResponseTime**: Validates response time performance
   - Expected: Response within 5 seconds

8. **testJobsSortedByCreationDate**: Validates jobs sorting
   - Expected: 200 status, jobs array returned

## Dependencies Used

### Testing Frameworks
- **JUnit 4.13.2**: Unit testing framework
- **TestNG 7.8.1**: Alternative testing framework with advanced features

### API Testing
- **REST Assured 5.3.2**: REST API testing library
- **Apache HttpClient 4.5.14**: HTTP client library

### Browser Automation
- **Selenium WebDriver 4.15.0**: Web browser automation
- **WebDriverManager 5.6.3**: Automatic WebDriver management

### Utilities
- **Gson 2.10.1**: JSON parsing and serialization

## Troubleshooting

### Problem: Tests fail with "Connection refused"

**Solution**: Ensure backend server is running on port 5001
```bash
# Check if port 5001 is in use
lsof -i :5001
```

### Problem: Maven command not found

**Solution**: Add Maven to PATH
```bash
# macOS with Homebrew
brew install maven

# Or manually add to ~/.zshrc
export PATH="/usr/local/opt/maven/bin:$PATH"
```

### Problem: Java version mismatch

**Solution**: Ensure JDK 11+ is installed
```bash
# Install with Homebrew
brew install openjdk@11

# Set JAVA_HOME
export JAVA_HOME=$(/usr/libexec/java_home -v 11)
```

### Problem: Test hangs or timeout

**Solution**: Increase timeout in tests or check server logs for errors

## Test Results

After running tests, Maven generates a report in:
```
target/surefire-reports/
```

View detailed test results:
```bash
# Open in terminal
cat target/surefire-reports/RegisterUserTest.txt
cat target/surefire-reports/GetAllJobsTest.txt
```

## CI/CD Integration

To integrate with CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: mvn clean test

- name: Upload Results
  if: always()
  uses: actions/upload-artifact@v2
  with:
    name: test-results
    path: target/surefire-reports/
```

## API Endpoints Tested

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "role": "job_seeker|employer"
  }
  ```
- **Success Response**: 201 Created
  ```json
  {
    "message": "User registered successfully",
    "token": "JWT_TOKEN",
    "user": {
      "id": "USER_ID",
      "name": "User Name",
      "email": "user@example.com",
      "role": "job_seeker|employer"
    }
  }
  ```

### Get All Jobs
- **Endpoint**: `GET /api/jobs`
- **Success Response**: 200 OK
  ```json
  [
    {
      "_id": "JOB_ID",
      "title": "Job Title",
      "description": "Job Description",
      "location": "City, Country",
      "type": "Full-time",
      "salary": 50000,
      "company": "Company Name",
      "employer": {
        "_id": "EMPLOYER_ID",
        "name": "Employer Name",
        "email": "employer@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```

## Extending Tests

To add more tests:

1. Create a new Java file in `src/test/java/com/jobportal/tests/api/`
2. Use the same structure as existing tests
3. Run: `mvn clean test`

Example:
```java
@Test
public void testNewFeature() {
    given()
        .contentType(ContentType.JSON)
        .when()
        .get("/new-endpoint")
        .then()
        .statusCode(200);
}
```

## Support & Documentation

- [Selenium Documentation](https://www.selenium.dev/documentation/)
- [REST Assured Documentation](https://rest-assured.io/)
- [Maven Official Guide](https://maven.apache.org/guides/)
- [JUnit Documentation](https://junit.org/junit4/)

## Notes

- Tests use hardcoded base URL `http://localhost:5001/api`. Modify in `ApiTestUtils.java` if needed.
- Some tests create new users; ensure unique emails or handle duplicate errors.
- For production testing, consider using a test database separate from development.
