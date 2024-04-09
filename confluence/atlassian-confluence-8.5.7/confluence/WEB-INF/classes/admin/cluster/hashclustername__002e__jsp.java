package admin.cluster;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.atlassian.confluence.util.HtmlUtil;
import com.atlassian.confluence.util.ClusterUtils;

public final class hashclustername__002e__jsp extends org.apache.sling.scripting.jsp.jasper.runtime.HttpJspBase
    implements org.apache.sling.scripting.jsp.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.sling.scripting.jsp.jasper.runtime.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_annotationprocessor = (org.apache.sling.scripting.jsp.jasper.runtime.AnnotationProcessor) getServletConfig().getServletContext().getAttribute(org.apache.sling.scripting.jsp.jasper.runtime.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html;charset=UTF-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, false, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("<html>\n");
      out.write("  <head><title>Generate Multicast IP address</title></head>\n");
      out.write("  <body>\n");
      out.write("\n");
      out.write("  <h1>Generate multicast IP address</h1>\n");
      out.write("\n");
      out.write("  <form action=\"\" method=\"get\">\n");
      out.write("\n");
      out.write("      <label>Cluster name: <input name=\"clusterName\" type=\"text\" value=\"\" ></label>\n");
      out.write("\n");
      out.write("      <button type=\"submit\">Generate</button>\n");
      out.write("  </form>\n");
      out.write("\n");
      out.write("  <h2>Generated address for cluster name \"");
      out.print( HtmlUtil.htmlEncode(request.getParameter("clusterName")) );
      out.write("\"</h2>\n");
      out.write("\n");
      out.write("  <div>");
      out.print( ClusterUtils.hashNameToMulticastAddress(request.getParameter("clusterName")).getHostAddress() );
      out.write("</div>\n");
      out.write("\n");
      out.write("  </body>\n");
      out.write("</html>\n");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
