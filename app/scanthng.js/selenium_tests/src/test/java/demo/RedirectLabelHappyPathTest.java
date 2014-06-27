package demo;

import junit.framework.Assert;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.support.ui.ExpectedCondition;

public class RedirectLabelHappyPathTest extends CommonSeleniumBase {

    @Test
        public void redirectlabelhappypath() {
        wd.setFileDetector(new ResourceFileDetector());
        wd.get(scanAppUrl);
        wd.findElement(By.id("scanlabel")).click();
        if ( !wd.findElement(By.id("redirect")).isSelected() ) {
            wd.findElement(By.id("redirect")).click();
        }
        wd.findElement(By.cssSelector("div.scanlabel.content > button")).click();

        try { Thread.sleep(1000l); } catch (Exception e) { throw new RuntimeException(e); }
        wd.findElement(By.cssSelector(".scanThng_form input")).click();
        wd.findElement(By.cssSelector(".scanThng_form input")).sendKeys("label.jpg");
        try { Thread.sleep(5000l); } catch (Exception e) { throw new RuntimeException(e); }
        Assert.assertEquals(expectedRedirectionUrl, wd.getCurrentUrl());
    }
}

