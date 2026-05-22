# Quick Start Guide for Running Tests

This guide helps you get started with running Selenium and Maven tests for the Job Portal API.

## 5-Minute Quick Start

### Step 1: Install Prerequisites (if not already installed)

```bash
# macOS - Install Java
brew install openjdk@11

# Install Maven
brew install maven

# Verify installation
java -version
mvn --version
```

### Step 2: Start Backend Server

```bash
cd /Users/piyushkumarsingh/Desktop/Job\ Protal\ copy/server
npm install  # Only first time
PORT=5001 node server.js
```

**Expected Output**: Server running on port 5001

### Step 3: Run Tests

Open a new terminal and run:

```bash
cd /Users/piyushkumarsingh/Desktop/Job\ Protal\ copy

# Run all tests
mvn clean test

# Or run specific test
mvn test -Dtest=RegisterUserTest
```

## Common Commands

```bash
# Run all tests
mvn clean test

# Run with detailed output
mvn clean test -X

# Run specific test class
mvn test -Dtest=RegisterUserTest
mvn test -Dtest=GetAllJobsTest

# Run specific test method
mvn test -Dtest=RegisterUserTest#testRegisterUserAsJobSeeker

# Skip tests during build
mvn clean install -DskipTests

# Generate test report
mvn clean test
# Reports available in: target/surefire-reports/
```

## Test Classes

### 1. RegisterUserTest
Tests the user registration API endpoint with various scenarios:
- Successful registration as job seeker
- Successful registration as employer
- Duplicate email handling
- Missing fields validation
- Invalid email format

**Run**: `mvn test -Dtest=RegisterUserTest`

### 2. GetAllJobsTest
Tests the get all jobs API endpoint:
- Successful jobs retrieval
- Response array validation
- Required fields verification
- Response headers check
- Single job retrieval by ID
- Invalid ID handling
- Response time performance
- Jobs sorting verification

**Run**: `mvn test -Dtest=GetAllJobsTest`

## File Structure Created

```
/Users/piyushkumarsingh/Desktop/Job Protal  copy/
├── pom.xml                                    # Maven configuration
├── TESTING_README.md                          # Detailed documentation
├── QUICK_START.md                             # This file
├── src/test/
│   ├── java/com/jobportal/tests/
│   │   ├── api/
│   │   │   ├── RegisterUserTest.java
│   │   │   └── GetAllJobsTest.java
│   │   └── utils/
│   │       └── ApiTestUtils.java
│   └── resources/
│       └── test.properties                    # Test configuration
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "mvn: command not found" | Install Maven: `brew install maven` |
| "Connection refused on port 5001" | Start backend: `cd server && PORT=5001 node server.js` |
| "Java version error" | Install Java 11: `brew install openjdk@11` |
| Tests timeout | Check server logs for errors; increase timeout in tests |
| Port 5001 already in use | Kill existing process: `lsof -i :5001` then `kill -9 <PID>` |

## Next Steps

1. **View Test Results**: Check `target/surefire-reports/` for detailed reports
2. **Add More Tests**: Follow the existing test structure to add new tests
3. **CI/CD Integration**: Copy test commands into your CI/CD pipeline
4. **Performance Testing**: Add more response time assertions
5. **Load Testing**: Use JMeter or Gatling for load tests

## Useful Links

- [Maven Official Site](https://maven.apache.org/)
- [REST Assured Documentation](https://rest-assured.io/)
- [JUnit Documentation](https://junit.org/junit4/)
- [Selenium Documentation](https://www.selenium.dev/)

---

**Created**: Automated test suite for Job Portal API
**Test Framework**: Maven + REST Assured + JUnit
**Target APIs**: Register User, Get All Jobs
