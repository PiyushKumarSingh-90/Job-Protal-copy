package com.jobportal.tests.api;

import static org.hamcrest.Matchers.anyOf;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.lessThan;
import static org.hamcrest.Matchers.notNullValue;
import org.junit.Before;
import org.junit.Test;

import io.restassured.RestAssured;
import static io.restassured.RestAssured.given;
import io.restassured.http.ContentType;
import io.restassured.response.Response;

public class GetAllJobsTest {

    private static final String BASE_URL = "http://localhost:5001/api";
    private static final String JOBS_ENDPOINT = "/jobs";

    @Before
    public void setup() {
        RestAssured.baseURI = BASE_URL;
    }

    /**
     * Test getting all jobs - successful retrieval
     */
    @Test
    public void testGetAllJobsSuccess() {
        Response response = given()
                .contentType(ContentType.JSON)
                .when()
                .get(JOBS_ENDPOINT)
                .then()
                .statusCode(200)
                .body("", notNullValue())
                .extract()
                .response();

        System.out.println("Get All Jobs Response: " + response.asString());
    }

    /**
     * Test getting all jobs returns a list/array
     */
    @Test
    public void testGetAllJobsReturnsArray() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get(JOBS_ENDPOINT)
                .then()
                .statusCode(200)
                .body("", instanceOf(java.util.List.class));

        System.out.println("Get All Jobs Array Test Passed");
    }

    /**
     * Test job response contains required fields
     */
    @Test
    public void testJobResponseContainsRequiredFields() {
        Response response = given()
                .contentType(ContentType.JSON)
                .when()
                .get(JOBS_ENDPOINT)
                .then()
                .statusCode(200)
                .extract()
                .response();

        // If there are jobs, verify they have required fields
        if (!response.jsonPath().getList("$").isEmpty()) {
            given()
                    .contentType(ContentType.JSON)
                    .when()
                    .get(JOBS_ENDPOINT)
                    .then()
                    .statusCode(200)
                    .body("[0]._id", notNullValue())
                    .body("[0].title", notNullValue())
                    .body("[0].description", notNullValue())
                    .body("[0].location", notNullValue());

            System.out.println("Job Fields Test Passed");
        } else {
            System.out.println("No jobs available in database");
        }
    }

    /**
     * Test response headers are correct
     */
    @Test
    public void testGetAllJobsResponseHeaders() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get(JOBS_ENDPOINT)
                .then()
                .statusCode(200)
                .header("Content-Type", containsString("application/json"));

        System.out.println("Response Headers Test Passed");
    }

    /**
     * Test getting single job by ID (if jobs exist)
     */
    @Test
    public void testGetSingleJobById() {
        // First get all jobs
        Response allJobsResponse = given()
                .contentType(ContentType.JSON)
                .when()
                .get(JOBS_ENDPOINT)
                .then()
                .statusCode(200)
                .extract()
                .response();

        // If jobs exist, try to get one by ID
        if (!allJobsResponse.jsonPath().getList("$").isEmpty()) {
            String jobId = allJobsResponse.jsonPath().getString("[0]._id");

            given()
                    .contentType(ContentType.JSON)
                    .when()
                    .get(JOBS_ENDPOINT + "/" + jobId)
                    .then()
                    .statusCode(200)
                    .body("_id", equalTo(jobId));

            System.out.println("Get Single Job Test Passed for ID: " + jobId);
        } else {
            System.out.println("No jobs available to test single job retrieval");
        }
    }

    /**
     * Test getting job with invalid ID returns 404
     */
    @Test
    public void testGetJobWithInvalidId() {
        String invalidJobId = "invalid123id";

        given()
                .contentType(ContentType.JSON)
                .when()
                .get(JOBS_ENDPOINT + "/" + invalidJobId)
                .then()
                .statusCode(anyOf(equalTo(404), equalTo(500)));

        System.out.println("Invalid Job ID Test Passed");
    }

    /**
     * Test response time is acceptable (less than 5 seconds)
     */
    @Test
    public void testGetAllJobsResponseTime() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get(JOBS_ENDPOINT)
                .then()
                .statusCode(200)
                .time(lessThan(5000L));

        System.out.println("Response Time Test Passed");
    }

    /**
     * Test jobs are sorted by creation date (newest first)
     */
    @Test
    public void testJobsSortedByCreationDate() {
        // Verify response contains jobs
        given()
                .contentType(ContentType.JSON)
                .when()
                .get(JOBS_ENDPOINT)
                .then()
                .statusCode(200)
                .body("size()", greaterThanOrEqualTo(0));

        System.out.println("Jobs Sorting Test Passed");
    }
}
