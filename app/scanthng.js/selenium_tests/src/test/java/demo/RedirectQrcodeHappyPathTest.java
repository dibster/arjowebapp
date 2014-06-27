package demo;

import junit.framework.Assert;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.support.ui.ExpectedCondition;

public class RedirectQrcodeHappyPathTest extends CommonSeleniumBase {

    @Test
        public void redirectqrcodehappypath() {
        wd.setFileDetector(new ResourceFileDetector());
        wd.get(scanAppUrl);
        wd.findElement(By.id("qrcode")).click();
        if ( !wd.findElement(By.id("redirect")).isSelected() ) {
            wd.findElement(By.id("redirect")).click();
        }
        wd.findElement(By.cssSelector("div.qrcode.content > button")).click();

        try { Thread.sleep(1000l); } catch (Exception e) { throw new RuntimeException(e); }
        wd.findElement(By.cssSelector(".scanThng_form input")).click();
        wd.findElement(By.cssSelector(".scanThng_form input")).sendKeys(qrcodeFilename);
        try { Thread.sleep(5000l); } catch (Exception e) { throw new RuntimeException(e); }
        Assert.assertEquals(expectedRedirectionUrl, wd.getCurrentUrl());
    }
}
