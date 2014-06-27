package demo;

import junit.framework.Assert;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.support.ui.ExpectedCondition;

public class RedirectBarcodeHappyPathTest extends CommonSeleniumBase {

    @Test
        public void redirectbarcodehappypath() {
        wd.setFileDetector(new ResourceFileDetector());
        wd.get(scanAppUrl);
        wd.findElement(By.id("barcode")).click();
        if ( !wd.findElement(By.id("redirect")).isSelected() ) {
            wd.findElement(By.id("redirect")).click();
        }
        wd.findElement(By.cssSelector("div.barcode.content > button")).click();

        try { Thread.sleep(1000l); } catch (Exception e) { throw new RuntimeException(e); }
        wd.findElement(By.cssSelector(".scanThng_form input")).click();
        wd.findElement(By.cssSelector(".scanThng_form input")).sendKeys("barcode.jpg");
        try { Thread.sleep(20000l); } catch (Exception e) { throw new RuntimeException(e); }
        Assert.assertEquals(expectedRedirectionUrl, wd.getCurrentUrl());
    }
}


