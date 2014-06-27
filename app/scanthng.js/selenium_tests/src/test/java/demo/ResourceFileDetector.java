package demo;

import java.io.File;
import java.net.URISyntaxException;
import java.net.URL;

import org.openqa.selenium.remote.FileDetector;

public class ResourceFileDetector implements FileDetector {

	@Override
	public File getLocalFile(CharSequence... keys) {
		StringBuilder builder = new StringBuilder();
	    for (CharSequence chars : keys) {
	      builder.append(chars);
	    }

	    String filepath = builder.toString();
	    System.out.println("Filepath : "+filepath);

	    // If empty string, no file is meant to be sent
	    if (filepath.isEmpty()) {
	        return null;
	    }
	    
	    URL url = ResourceFileDetector.class.getResource("/"+filepath);
	    File result = null;
		try {
			System.out.println("Url : "+url);
			result = new File(url.toURI());
			System.out.println("result : "+result);
		} catch (URISyntaxException e) {
			
			e.printStackTrace();
		}
	    
	    return result;
	}

}
