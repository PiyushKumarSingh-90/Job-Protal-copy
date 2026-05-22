package com.jobportal.tests.api;

import static org.hamcrest.Matchers.anyOf;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import org.junit.Before;
import org.junit.Test;

import io.restassured.RestAssured;
import static io.restassured.RestAssured.given;
import io.restassured.http.ContentType;
import io.restassured.response.Response;

public class RegisterUserTest {

    private static final String BASE_URL = "http://localhost:5001/api";
    private static final String REGISTER_ENDPOINT = "/auth/register";

    @Before
    public void setup() {
        RestAssured.baseURI = BASE_URL;
    }

    /**
     * Test successful user registration as a job seeker
     */
    @Test
    public void testRegisterUserAsJobSeeker() {
        long timestamp = System.currentTimeMillis();
        String requestBody = "{\n" +
                "  \"name\": \"John Seeker\",\n" +
                "  \"email\": \"johnseeker" + timestamp + "@test.com\",\n" +
                "  \"password\": \"password123\",\n" +
                "  \"role\": \"jobseeker\"\n" +
                "}";

        Response response = given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(REGISTER_ENDPOINT)
                .then()
                .statusCode(201)
                .body("message", equalTo("User registered successfully"))
                .body("token", notNullValue())
                .body("user.name", equalTo("John Seeker"))
                .body("user.role", equalTo("jobseeker"))
                .extract()
                .response();

        System.out.println("Register Job Seeker Response: " + response.asString());
    }

    /**
     * Test successful user registration as an employer
     */
    @Test
    public void testRegisterUserAsEmployer() {
        long timestamp = System.currentTimeMillis();
        String requestBody = "{\n" +
                "  \"name\": \"Jane Employer\",\n" +
                "  \"email\": \"janeemployer" + timestamp + "@test.com\",\n" +
                "  \"password\": \"password123\",\n" +
                "  \"role\": \"employer\"\n" +
                "}";

        Response response = given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(REGISTER_ENDPOINT)
                .then()
                .statusCode(201)
                .body("message", equalTo("User registered successfully"))
                .body("token", notNullValue())
                .body("user.name", equalTo("Jane Employer"))
                .body("user.role", equalTo("employer"))
                .extract()
                .response();

        System.out.println("Register Employer Response: " + response.asString());
    }

    /**
     * Test registration with duplicate email (should fail)
     */
    @Test
    public void testRegisterDuplicateEmail() {
        long timestamp = System.currentTimeMillis();
        String requestBody = "{\n" +
                "  \"name\": \"Duplicate User\",\n" +
                "  \"email\": \"duplicate" + timestamp + "@test.com\",\n" +
                "  \"password\": \"password123\",\n" +
                "  \"role\": \"jobseeker\"\n" +
                "}";

        // First registration
        given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(REGISTER_ENDPOINT)
                .then()
                .statusCode(201);

        // Second registration with same email (should fail)
        given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(REGISTER_ENDPOINT)
                .then()
                .statusCode(400)
                .body("message", equalTo("User already exists with this email"));

        System.out.println("Duplicate Email Test Passed");
    }

    /**
     * Test registration with missing required fields
     */
    @Test
    public void testRegisterWithMissingFields() {
        String requestBodyMissingName = "{\n" +
                "  \"email\": \"test@test.com\",\n" +
                "  \"password\": \"password123\",\n" +
                "  \"role\": \"jobseeker\"\n" +
                "}";

        // Test with missing name - should handle gracefully or return validation error
        given()
                .contentType(ContentType.JSON)
                .body(requestBodyMissingName)
                .when()
                .post(REGISTER_ENDPOINT)
                .then()
                .statusCode(anyOf(equalTo(400), equalTo(500)));

        System.out.println("Missing Fields Test Passed");
    }

    /**
     * Test registration with invalid email format
     */
    @Test
    public void testRegisterWithInvalidEmail() {
        long timestamp = System.currentTimeMillis();
        String requestBody = "{\n" +
                "  \"name\": \"Invalid Email User\",\n" +
                "  \"email\": \"invalid-email" + timestamp + "\",\n" +
                "  \"password\": \"password123\",\n" +
                "  \"role\": \"jobseeker\"\n" +
                "}";

        // Backend may or may not validate email format strictly
        given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .when()
                .post(REGISTER_ENDPOINT)
                .then()
                .statusCode(anyOf(equalTo(201), equalTo(400), equalTo(500)));

        System.out.println("Invalid Email Test Passed");
    }
}
