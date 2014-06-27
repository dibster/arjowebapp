package demo;

import junit.framework.Assert;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class LabelHappyPathTest extends CommonSeleniumBase {

    @Test
        public void labelhappypath() {
        wd.setFileDetector(new ResourceFileDetector());
        wd.get(scanAppUrl);
        wd.findElement(By.id("scanlabel")).click();
        wd.findElement(By.cssSelector("div.scanlabel.content > button")).click();
        try { Thread.sleep(1000l); } catch (Exception e) { throw new RuntimeException(e); }
        wd.findElement(By.cssSelector(".scanThng_form input")).click();
        wd.findElement(By.cssSelector(".scanThng_form input")).sendKeys("label.jpg");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#results")));
        Assert.assertEquals(expectedJsonResponse, wd.findElement(By.id("results")).getText());
    }
}
