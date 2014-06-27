package demo;

import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.support.ui.ExpectedConditions;


public class RedirectLabelSadPathTest extends CommonSeleniumBase {

    @Test
        public void redirectlabelsadpathtest() {
        wd.setFileDetector(new ResourceFileDetector());
        wd.get(scanAppUrl);
        wd.findElement(By.id("scanlabel")).click();
        if ( !wd.findElement(By.id("redirect")).isSelected() ) {
            wd.findElement(By.id("redirect")).click();
        }
        wd.findElement(By.cssSelector("div.scanlabel.content > button")).click();

        try { Thread.sleep(1000l); } catch (Exception e) { throw new RuntimeException(e); }
        wd.findElement(By.cssSelector(".scanThng_form input")).click();
        wd.findElement(By.cssSelector(".scanThng_form input")).sendKeys(qrcodeFilename);
        try { Thread.sleep(21000l); } catch (Exception e) { throw new RuntimeException(e); }
        Assert.assertEquals("\"{\\\"status\\\":404,\\\"errors\\\":[\\\"No service was able to identify the image\\\"],\\\"moreInfo\\\":\\\"https://dev.evrythng.com/documentation/api#scanthng\\\"}\"", wd.findElement(By.id("results")).getText());

		// Assert that the current base URL is the expected base URL
		// Assigning scanAppUrl to expectedUrl is just making the tests
		// more readable (which is good practice, btw).
		String expectedUrl = scanAppUrl;
		Assert.assertEquals(expectedUrl, wd.getCurrentUrl().substring(0,expectedUrl.length()));
    }
}
