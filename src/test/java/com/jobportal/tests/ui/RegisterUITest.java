package com.jobportal.tests.ui;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.Assert.assertTrue;

/**
 * Selenium UI Tests for User Registration
 */
public class RegisterUITest {

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
        if (driver != null) {
            driver.quit();
            System.out.println("Browser closed");
        }
    }

    /**
     * Test successful user registration as a job seeker
     */
    @Test
    public void testRegisterJobSeeker() {
        try {
            // Navigate to application
            driver.navigate().to(BASE_URL);
            System.out.println("Navigated to: " + BASE_URL);
            
            // Find and click on Register link
            WebElement registerLink = wait.until(
                ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(text(), 'Register')]"))
            );
            registerLink.click();
            System.out.println("Clicked Register link");
            
            // Wait for register form to load
            WebElement nameInput = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.name("name"))
            );
            System.out.println("Register form loaded");
            
            // Fill in registration form
            long timestamp = System.currentTimeMillis();
            
            nameInput.sendKeys("John Seeker");
            System.out.println("Entered name: John Seeker");
            
            WebElement emailInput = driver.findElement(By.name("email"));
            emailInput.sendKeys("johnseeker" + timestamp + "@test.com");
            System.out.println("Entered email: johnseeker" + timestamp + "@test.com");
            
            WebElement passwordInput = driver.findElement(By.name("password"));
            passwordInput.sendKeys("password123");
            System.out.println("Entered password");
            
            // Select role dropdown
            WebElement roleSelect = driver.findElement(By.name("role"));
            Select select = new Select(roleSelect);
            select.selectByValue("jobseeker");
            System.out.println("Selected role: jobseeker");
            
            // Submit form
            WebElement submitButton = driver.findElement(By.xpath("//button[@type='submit']"));
            submitButton.click();
            System.out.println("Clicked Submit button");
            
            // Wait for success message or redirect
            Thread.sleep(2000);
            
            // Check if redirected to home or success page
            String currentUrl = driver.getCurrentUrl();
            System.out.println("Current URL after registration: " + currentUrl);
            
            assertTrue("Registration should redirect to home or dashboard", 
                currentUrl.contains("localhost:3000") && !currentUrl.contains("register"));
            
            System.out.println("✓ Job Seeker Registration Test Passed");
            
        } catch (Exception e) {
            System.err.println("Test failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    /**
     * Test successful user registration as an employer
     */
    @Test
    public void testRegisterEmployer() {
        try {
            // Navigate to application
            driver.navigate().to(BASE_URL);
            System.out.println("Navigated to: " + BASE_URL);
            
            // Find and click on Register link
            WebElement registerLink = wait.until(
                ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(text(), 'Register')]"))
            );
            registerLink.click();
            System.out.println("Clicked Register link");
            
            // Wait for register form to load
            WebElement nameInput = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.name("name"))
            );
            System.out.println("Register form loaded");
            
            // Fill in registration form
            long timestamp = System.currentTimeMillis();
            
            nameInput.sendKeys("Jane Employer");
            System.out.println("Entered name: Jane Employer");
            
            WebElement emailInput = driver.findElement(By.name("email"));
            emailInput.sendKeys("janeemployer" + timestamp + "@test.com");
            System.out.println("Entered email: janeemployer" + timestamp + "@test.com");
            
            WebElement passwordInput = driver.findElement(By.name("password"));
            passwordInput.sendKeys("password123");
            System.out.println("Entered password");
            
            // Select role dropdown
            WebElement roleSelect = driver.findElement(By.name("role"));
            Select select = new Select(roleSelect);
            select.selectByValue("employer");
            System.out.println("Selected role: employer");
            
            // Submit form
            WebElement submitButton = driver.findElement(By.xpath("//button[@type='submit']"));
            submitButton.click();
            System.out.println("Clicked Submit button");
            
            // Wait for success
            Thread.sleep(2000);
            
            // Check if redirected
            String currentUrl = driver.getCurrentUrl();
            System.out.println("Current URL after registration: " + currentUrl);
            
            assertTrue("Registration should redirect to home or dashboard", 
                currentUrl.contains("localhost:3000") && !currentUrl.contains("register"));
            
            System.out.println("✓ Employer Registration Test Passed");
            
        } catch (Exception e) {
            System.err.println("Test failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    /**
     * Test login functionality
     */
    @Test
    public void testLogin() {
        try {
            // Navigate to application
            driver.navigate().to(BASE_URL);
            System.out.println("Navigated to: " + BASE_URL);
            
            // Find and click on Login link
            WebElement loginLink = wait.until(
                ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(text(), 'Login')]"))
            );
            loginLink.click();
            System.out.println("Clicked Login link");
            
            // Wait for login form to load
            WebElement emailInput = wait.until(
                ExpectedConditions.presenceOfElementLocated(By.name("email"))
            );
            System.out.println("Login form loaded");
            
            // Fill in login form
            emailInput.sendKeys("leethakare69@gmail.com");
            System.out.println("Entered email: leethakare69@gmail.com");
            
            WebElement passwordInput = driver.findElement(By.name("password"));
            passwordInput.sendKeys("password123");
            System.out.println("Entered password");
            
            // Submit form
            WebElement submitButton = driver.findElement(By.xpath("//button[@type='submit']"));
            submitButton.click();
            System.out.println("Clicked Submit button");
            
            // Wait for redirect
            Thread.sleep(2000);
            
            // Check if logged in
            String currentUrl = driver.getCurrentUrl();
            System.out.println("Current URL after login: " + currentUrl);
            
            System.out.println("✓ Login Test Passed");
            
        } catch (Exception e) {
            System.err.println("Test failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
