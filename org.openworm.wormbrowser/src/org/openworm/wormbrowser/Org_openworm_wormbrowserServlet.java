package org.openworm.wormbrowser;
import java.io.IOException;
import javax.servlet.http.*;

@SuppressWarnings("serial")
public class Org_openworm_wormbrowserServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("text/plain");
		resp.getWriter().println("I write ze codez, I am cool!");
	}
}
