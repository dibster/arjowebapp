package demo;

import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class RedirectQrcodeSadPathTest extends CommonSeleniumBase {

    @Test
        public void redirectqrcodesadpath() {
        wd.setFileDetector(new ResourceFileDetector());
        wd.get(scanAppUrl);
        wd.findElement(By.id("qrcode")).click();
        if ( !wd.findElement(By.id("redirect")).isSelected() ) {
            wd.findElement(By.id("redirect")).click();
        }
        wd.findElement(By.cssSelector("div.qrcode.content > button")).click();

        try { Thread.sleep(1000l); } catch (Exception e) { throw new RuntimeException(e); }
        wd.findElement(By.cssSelector(".scanThng_form input")).click();
        wd.findElement(By.cssSelector(".scanThng_form input")).sendKeys("label.jpg");
        try { Thread.sleep(21000l); } catch (Exception e) { throw new RuntimeException(e); }

		// Assert that the current base URL is the expected base URL
		// Assigning scanAppUrl to expectedUrl is just making the tests
		// more readable (which is good practice, btw).
		String expectedUrl = scanAppUrl;
		Assert.assertEquals(expectedUrl, wd.getCurrentUrl().substring(0,expectedUrl.length()));
    }
}
