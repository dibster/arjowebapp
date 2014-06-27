/*
 * (c) Copyright 2012 EVRYTHNG Ltd London / Zurich
 * www.evrythng.com
 */
package demo;

import java.net.URL;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TestName;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.saucelabs.common.SauceOnDemandAuthentication;
import com.saucelabs.common.SauceOnDemandSessionIdProvider;
import com.saucelabs.common.Utils;
import com.saucelabs.junit.SauceOnDemandTestWatcher;

/**
 * TODO: comment this class
 *
 **/
public abstract class CommonSeleniumBase implements SauceOnDemandSessionIdProvider {

	private String sessionId;
	public SauceOnDemandAuthentication authentication = new SauceOnDemandAuthentication("evrythng", "0f7b3467-c938-4605-93c1-f50a0bc88f1b");
	public @Rule
	SauceOnDemandTestWatcher resultReportingTestWatcher = new SauceOnDemandTestWatcher(this, authentication);
	public @Rule
	TestName testName = new TestName();

	public String getSessionId() {
		return sessionId;
	}

	protected RemoteWebDriver wd;
	protected WebDriverWait wait;
	protected String scanAppUrl;
	protected String scanAppUrlParams;
	protected String expectedRedirectionUrl;
	protected String qrcodeFilename;
	protected String expectedJsonResponse;
	protected String expectedProductId;

	//	    @Before
	//	    public void setUp() throws Exception {
	//	        DesiredCapabilities caps = DesiredCapabilities.firefox();
	//	            caps.setCapability("name", "volvo-demo-portal-uat");
	//	        wd = new RemoteWebDriver(
	//	            new URL("http://evrythng:0f7b3467-c938-4605-93c1-f50a0bc88f1b@ondemand.saucelabs.com:80/wd/hub"),
	//	            caps);
	//	        wd.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);
	//	        sessionId = wd.getSessionId().toString();
	//	    }
	@Before
	public void setUp() throws Exception {

		DesiredCapabilities capabilities = new DesiredCapabilities();
		String version = Utils.readPropertyOrEnv("SELENIUM_VERSION", "");
		if (!version.equals("")) {
			capabilities.setCapability("version", version);
		}
		capabilities.setCapability("platform", Utils.readPropertyOrEnv("SELENIUM_PLATFORM", "Linux"));
		capabilities.setCapability("browserName", Utils.readPropertyOrEnv("SELENIUM_BROWSER", "firefox"));
		String username = Utils.readPropertyOrEnv("SAUCE_USER_NAME", "evrythng");
		String accessKey = Utils.readPropertyOrEnv("SAUCE_API_KEY", "0f7b3467-c938-4605-93c1-f50a0bc88f1b");

		String baseScanAppUrl = "http://scanapp-test.herokuapp.com";

		// This allows to specify different the Scanthng Service URL, apiKey,
		// scanthngJS location and other params (see scanApp documentation)
		String serviceUrl = Utils.readPropertyOrEnv("SCANAPP_SERVICE_URL", "");
		String apiKey = Utils.readPropertyOrEnv("SCANAPP_API_KEY", "");
		String scanthngJsUrl = Utils.readPropertyOrEnv("SCANAPP_SCANTHNGJS_URL", "");

		// We need this completeServiceUrl to make the production URL for
		// the ScanThng Service explicit (no need to pass it to scanApp,
		// because scanApp already has it as a default).
		String completeServiceUrl = ( serviceUrl.equals("") ? "https://api.evrythng.com" : serviceUrl );

		this.expectedRedirectionUrl = Utils.readPropertyOrEnv("SCANAPP_REDIRECTION_URL", "https://www.google.com/5356446ce4b0eec2cc67f633");
		String expectedProductId = Utils.readPropertyOrEnv("SCANAPP_EXPECTED_PRODUCT_ID", "5356446ce4b0eec2cc67f633");
		String expectedShortId = Utils.readPropertyOrEnv("SCANAPP_EXPECTED_SHORT_ID", "V5D6VsUWHH");
		String expectedShortDomain = Utils.readPropertyOrEnv("SCANAPP_EXPECTED_SHORT_DOMAIN", "tn.gg");
		this.qrcodeFilename = Utils.readPropertyOrEnv("SCANAPP_QRCODE_FILENAME", "qrcode_production.png");
		this.scanAppUrl = baseScanAppUrl + "/?" +
			(serviceUrl.equals("") ? "" : ("serviceUrl=" + serviceUrl + "&")) +
			(apiKey.equals("") ? "" : ("apiKey=" + apiKey + "&")) +
			(scanthngJsUrl.equals("") ? "" : ("scanthngUrl=" + scanthngJsUrl + "&"));

		this.expectedJsonResponse = "{\"shortDomain\":\"" + expectedShortDomain + "\"," +
			"\"defaultRedirectUrl\":\"" +
			this.expectedRedirectionUrl +
			"\",\"type\":\"product\"," +
			"\"evrythngUrl\":\"" + completeServiceUrl + "/products/" + expectedProductId + "\"," +
			"\"shortId\":\"" + expectedShortId + "\",\"evrythngId\":\"" + expectedProductId + "\"}";

		this.wd = new RemoteWebDriver(new URL("http://" + username + ":" + accessKey + "@ondemand.saucelabs.com:80/wd/hub"), capabilities);
		this.sessionId = wd.getSessionId().toString();

		this.wait = new WebDriverWait(wd, 30); // wait for a maximum of 30 seconds
        String message = String.format("SauceOnDemandSessionID=%1$s job-name=%2$s", this.sessionId , "Scanthng end-to-end");
        System.out.println(message);

	}

	@After
	public void tearDown() {
		wd.quit();
	}

	public static boolean isAlertPresent(FirefoxDriver wd) {
		try {
			wd.switchTo().alert();
			return true;
		} catch (NoAlertPresentException e) {
			return false;
		}
	}

	protected String randomName(String root) {
		String suffix = new Long(System.currentTimeMillis() % 100000L).toString();
		return (root + "_" + suffix);
	}
}
