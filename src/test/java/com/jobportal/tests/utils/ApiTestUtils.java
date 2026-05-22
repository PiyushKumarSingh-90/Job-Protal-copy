package com.jobportal.tests.utils;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;

/**
 * Utility class for API testing operations
 */
public class ApiTestUtils {

    public static final String BASE_URL = "http://localhost:5001/api";

    /**
     * Initialize REST Assured base configuration
     */
    public static void initializeRestAssured() {
        RestAssured.baseURI = BASE_URL;
    }

    /**
     * Register a user and return the authentication token
     */
    public static String registerAndGetToken(String name, String email, String password, String role) {
        String requestBody = String.format(
                "{\n  \"name\": \"%s\",\n  \"email\": \"%s\",\n  \"password\": \"%s\",\n  \"role\": \"%s\"\n}",
                name, email, password, role
        );

        Response response = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .post("/auth/register");

        if (response.statusCode() == 201) {
            return response.jsonPath().getString("token");
        } else if (response.statusCode() == 400 && response.jsonPath().getString("message").contains("already exists")) {
            // User already exists, try to login instead
            return loginAndGetToken(email, password);
        }

        throw new RuntimeException("Failed to register user: " + response.asString());
    }

    /**
     * Login user and return the authentication token
     */
    public static String loginAndGetToken(String email, String password) {
        String requestBody = String.format(
                "{\n  \"email\": \"%s\",\n  \"password\": \"%s\"\n}",
                email, password
        );

        Response response = RestAssured.given()
                .contentType(ContentType.JSON)
                .body(requestBody)
                .post("/auth/login");

        if (response.statusCode() == 200) {
            return response.jsonPath().getString("token");
        }

        throw new RuntimeException("Failed to login user: " + response.asString());
    }

    /**
     * Get the current user information
     */
    public static Response getCurrentUser(String token) {
        return RestAssured.given()
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + token)
                .get("/auth/me");
    }
}
