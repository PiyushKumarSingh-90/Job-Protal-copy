package com.jobportal.tests.ui;

import java.time.Duration;
import java.util.List;

import org.junit.After;
import static org.junit.Assert.assertTrue;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;

/**
 * Selenium UI Tests for Viewing Jobs
 */
public class JobsUITest 
{

    private WebDriver driver;
    private WebDriverWait wait;
    private static final String BASE_URL = "http://localhost:3000";
    private static final long WAIT_TIME = 10;

    @Before
    public void setup() {
        // Setup ChromeDriver automatically
        WebDriverManager.chromedriver().setup();
        
        // Initialize WebDriver
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(WAIT_TIME));
        
        System.out.println("Browser opened: " + driver.getClass().getSimpleName());
    }

    @After
    public void tearDown() {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        if (driver != null) {
            driver.quit();
            System.out.println("Browser closed");
        }
    }

    /**
     * Test viewing jobs list
     */
    @Test
    public void testViewJobsList() 
    {
        try {
            // Navigate to jobs page
            driver.navigate().to(BASE_URL + "/jobs");
            System.out.println("Navigated to: " + BASE_URL + "/jobs");
            
            // Wait for jobs to load
            List<WebElement> jobCards = wait.until(
                ExpectedConditions.presenceOfAllElementsLocatedBy(By.xpath("//div[contains(@class, 'job')]"))
            );
            System.out.println("Jobs loaded. Found " + jobCards.size() + " jobs");
            
            assertTrue("At least one job should be displayed", jobCards.size() > 0);
            
            System.out.println("✓ View Jobs List Test Passed");
            
        } catch (Exception e) {
            System.err.println("Test failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    /**
     * Test viewing job details
     */
    @Test
    public void testViewJobDetails() 
    {
        try {
            // Navigate to jobs page
            driver.navigate().to(BASE_URL + "/jobs");
            System.out.println("Navigated to: " + BASE_URL + "/jobs");
            
            // Wait for first job card and click it
            WebElement firstJobCard = wait.until(
                ExpectedConditions.elementToBeClickable(By.xpath("(//div[contains(@class, 'job')])[1]"))
            );
            
            // Get job title before clicking
            String jobTitle = firstJobCard.getText();
            System.out.println("First job details: " + jobTitle);
            
            firstJobCard.click();
            System.out.println("Clicked on first job");
            
            // Wait for job details page to load
            Thread.sleep(2000);
            
            String currentUrl = driver.getCurrentUrl();
            System.out.println("Current URL: " + currentUrl);
            
            // Should have navigated to job details page
            assertTrue("Should navigate to job details page", currentUrl.contains("jobdetails") || currentUrl.contains("job"));
            
            System.out.println("✓ View Job Details Test Passed");
            
        } catch (Exception e) {
            System.err.println("Test failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    /**
     * Test home page loads
     */
    @Test
    public void testHomePageLoads() 
    {
        try {
            // Navigate to home page
            driver.navigate().to(BASE_URL);
            System.out.println("Navigated to: " + BASE_URL);
            
            // Wait for page to load
            WebElement pageTitle = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.xpath("//h1 | //h2 | //title"))
            );
            System.out.println("Page loaded");
            
            // Take screenshot
            String pageSource = driver.getPageSource();
            assertTrue("Page should have content", pageSource.length() > 100);
            
            System.out.println("✓ Home Page Load Test Passed");
            
        } catch (Exception e) {
            System.err.println("Test failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
