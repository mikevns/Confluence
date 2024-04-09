import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.atlassian.config.util.BootstrapUtils;
import com.atlassian.confluence.cluster.ClusterInformation;
import com.atlassian.confluence.cluster.ClusterManager;
import com.atlassian.confluence.impl.core.persistence.hibernate.ExceptionMonitorPredicates;
import com.atlassian.confluence.jmx.RequestMetrics;
import com.atlassian.confluence.plugin.persistence.PluginDataDao;
import com.atlassian.confluence.plugin.persistence.PluginDataWithoutBinary;
import com.atlassian.confluence.status.SystemErrorInformationLogger;
import com.atlassian.confluence.status.service.SystemInformationService;
import com.atlassian.confluence.status.service.systeminfo.ConfluenceInfo;
import com.atlassian.confluence.status.service.systeminfo.DatabaseInfo;
import com.atlassian.confluence.status.service.systeminfo.MemoryInfo;
import com.atlassian.confluence.util.GeneralUtil;
import com.atlassian.confluence.util.HtmlUtil;
import com.atlassian.confluence.util.I18NSupport;
import com.atlassian.core.logging.DatedLoggingEvent;
import com.atlassian.core.logging.ThreadLocalErrorCollection;
import com.atlassian.plugin.Plugin;
import com.atlassian.plugin.PluginInformation;
import com.atlassian.seraph.auth.DefaultAuthenticator;
import com.atlassian.spring.container.ContainerManager;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.spi.LoggingEvent;
import java.io.PrintWriter;
import java.security.Principal;
import java.text.DateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import javax.servlet.http.HttpSession;
import com.atlassian.confluence.core.ConfluenceSystemProperties;
import com.atlassian.confluence.impl.logging.ConfluenceStackTraceRenderer;

public final class __0035__00page__002e__jsp extends org.apache.sling.scripting.jsp.jasper.runtime.HttpJspBase
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
    Throwable exception = org.apache.sling.scripting.jsp.jasper.runtime.JspRuntimeLibrary.getThrowable(request);
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html");
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
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
      out.write("\n");
 String context = request.getContextPath(); 
      out.write('\n');
 HttpSession session = request.getSession(); 
      out.write('\n');
 try { 
      out.write("\n");
      out.write("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">\n");
      out.write("<html>\n");
      out.write("<head>\n");
      out.write("    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n");
      out.write("    <title>Oops - an error has occurred</title>\n");
      out.write("</head>\n");
      out.write("<body>\n");
      out.write("<div id=\"PageContent\">\n");
      out.write("<h1>\n");
      out.write("    <img src=\"");
      out.print( context );
      out.write("/images/logo/confluence-logo-adg3.svg\" style=\"height:24px;\" alt=\"logo\" title=\"Confluence\">\n");
      out.write("    System Error\n");
      out.write("</h1>\n");
      out.write("\n");
      out.write("<div id=\"sysErrPanel\" class=\"panel\">\n");
      out.write("    <p>\n");
      out.write("        A system error has occurred &mdash; our apologies!\n");
      out.write("    </p>\n");
      out.write("    <p>\n");
      out.write("        For immediate troubleshooting, consult our <strong><a href=\"");
      out.print( I18NSupport.getText("url.confluence.knowledge.base") );
      out.write("\">knowledge base</a></strong> for a solution.\n");
      out.write("    </p>\n");
      out.write("    <p>\n");
      out.write("        If you would like to receive support from Atlassian's support team, ask your\n");
      out.write("        <strong><a href=\"");
      out.print( context );
      out.write("/contactadministrators.action\">Confluence administrator</a></strong> to create a support issue on <a href=\"");
      out.print( I18NSupport.getText("url.support") );
      out.write("\">Atlassian's support system</a> with the following information:\n");
      out.write("    </p>\n");
      out.write("    <ol>\n");
      out.write("        <li>a description of your problem and what you were doing at the time it occurred</li>\n");
      out.write("        <li>a copy of the error and system information found below</li>\n");
      out.write("        <li>a copy of the application logs (if possible).</li>\n");
      out.write("    </ol>\n");
      out.write("    <p>\n");
      out.write("        Your Confluence administrator can use the\n");
      out.write("        <strong><a href=\"");
      out.print( context );
      out.write("/admin/raisesupportrequest.action\">support request form</a></strong>\n");
      out.write("        to create a support ticket which will include this information.\n");
      out.write("    </p>\n");
      out.write("    <p>\n");
      out.write("        We will respond as promptly as possible.<br>\n");
      out.write("        Thank you!\n");
      out.write("    </p>\n");
      out.write("    <p>\n");
      out.write("        <a href=\"");
      out.print( context );
      out.write("/\"><strong>Return to site homepage&hellip;</strong></a>\n");
      out.write("    </p>\n");
      out.write("</div>\n");
      out.write("\n");
      out.write("        ");

        	UUID uniqueID = UUID.randomUUID();  // enable an easy mapping between this page and the error log.
        	SystemErrorInformationLogger logAction = new SystemErrorInformationLogger(uniqueID, pageContext.getServletContext(), request, exception);
            logAction.writeToLog(false);
            RequestMetrics.incrementErrorCount();


            SystemInformationService sysInfoService = null;
            PluginDataDao pluginDataDao = null;
            Throwable sysInfoRetrievalFailure = null;
            try
            {
                sysInfoService = ((SystemInformationService) ContainerManager.getInstance().getContainerContext().getComponent("systemInformationService"));
                pluginDataDao = (PluginDataDao) ContainerManager.getInstance().getContainerContext().getComponent("pluginDataDao");
            }
            catch (Throwable t)
            {
                sysInfoRetrievalFailure = t;
            }

        	if (sysInfoService == null)
        	{
        		out.println("The SystemInformationService could not be retrieved from the container.");
        		out.println("Therefore very limited information is available in this error report. <br>");
                if (sysInfoRetrievalFailure != null)
                {
      out.write("The SystemInformationService could not be retrieved due to the following error:\n");
      out.write("                   ");
      out.print( HtmlUtil.htmlEncode(String.valueOf(sysInfoRetrievalFailure)) );
      out.write("<br>");

                }
            }
        
      out.write("\n");
      out.write("\n");
      out.write("    ");

        String uri = (String)request.getAttribute("javax.servlet.error.request_uri");
        if(uri != null && uri.contains("editpage"))
        {
            String editDraft = context + "/pages/editpage.action?useDraft=true&pageId=" + HtmlUtil.htmlEncode(request.getParameter("pageId"));
            
      out.write("\n");
      out.write("            <div class=\"panel warning\">\n");
      out.write("                <img id=\"draftNote\" alt=\"\" src=\"");
      out.print( context );
      out.write("/images/icons/emoticons/warning.png\">\n");
      out.write("                You can <a href=\"");
      out.print( editDraft );
      out.write("\">resume editing</a> the most recently saved draft of your page.\n");
      out.write("            </div>\n");
      out.write("        ");

        }
    
      out.write("\n");
      out.write("\n");
      out.write("    <h3>Cause</h3>\n");
      out.write("    ");

        if (exception == null) {
    
      out.write("\n");
      out.write("            <p>Unknown</p>\n");
      out.write("    ");

        } else if (ConfluenceSystemProperties.isDevMode()) {
    
      out.write("\n");
      out.write("            <h4>Stack Trace (Dev Mode):<span class=\"switch\" id=\"stacktrace-switch\" onclick=\"toggle('stacktrace')\">[hide]</span></h4>\n");
      out.write("            <pre id=\"stacktrace\">\n");
      out.write("                ");
      out.print( HtmlUtil.htmlEncode(ConfluenceStackTraceRenderer.renderStackTrace(exception).toString()) );
      out.write("\n");
      out.write("            </pre>\n");
      out.write("    ");

        } else {
    
      out.write("\n");
      out.write("            <p>\n");
      out.write("                <strong>Exception ID:</strong> ");
      out.print( logAction.logException() );
      out.write("\n");
      out.write("            </p>\n");
      out.write("    ");

        }
    
      out.write("\n");
      out.write("\n");
      out.write("        <h3>Referer URL</h3>\n");
      out.write("        <p>");
      out.print( request.getHeader("Referer") != null ? HtmlUtil.htmlEncode(request.getHeader("Referer")) : "Unknown" );
      out.write("</p>\n");
      out.write("\n");
      out.write("        ");
 if ((sysInfoService != null) && !ExceptionMonitorPredicates.shortCircuitRequestTester().test(request) && sysInfoService.isShowInfoOn500()) {
      out.write("\n");
      out.write("            <h3>Confluence Application Information</h3>\n");
      out.write("            <h4>Build Information</h4>\n");
      out.write("            <p>\n");
      out.write("            ");

                ConfluenceInfo confluenceInfo = sysInfoService.getConfluenceInfo();
                if (confluenceInfo != null) {

                    Map buildstats = GeneralUtil.convertBeanToMap(confluenceInfo);

                    // remove the properties that we don't want to display in the maps
                    buildstats.remove("enabledPlugins");
                    buildstats.remove("startTime");
                    buildstats.remove("globalSettings");


                    for (Iterator it = buildstats.entrySet().iterator(); it.hasNext();)
                    {
                        Map.Entry entry = (Map.Entry) it.next();
            
      out.write("\n");
      out.write("                    ");
      out.print( entry.getKey() );
      out.write(':');
      out.write(' ');
      out.print( entry.getValue() );
      out.write("<br>\n");
      out.write("            ");
      }
                } else { 
      out.write("\n");
      out.write("                No build information available.\n");
      out.write("            ");
  } 
      out.write("\n");
      out.write("                Unique ID: ");
      out.print( uniqueID.toString());
      out.write("\n");
      out.write("            </p>\n");
      out.write("\n");
      out.write("            <h4>Server information</h4>\n");
      out.write("            <p>\n");
      out.write("                Application Server: ");
      out.print( application.getServerInfo() );
      out.write("<br>\n");
      out.write("                Servlet Version: ");
      out.print( application.getMajorVersion() );
      out.write('.');
      out.print( application.getMinorVersion() );
      out.write("<br>\n");
      out.write("                ");

                    DatabaseInfo dbInfo = sysInfoService.getSafeDatabaseInfo();
                    if (dbInfo != null) { 
      out.write("\n");
      out.write("                    Database Dialect: ");
      out.print( dbInfo.getDialect() );
      out.write("<br>\n");
      out.write("                    Database Driver Name: ");
      out.print( dbInfo.getDriverName() );
      out.write("<br>\n");
      out.write("                ");
 } else { 
      out.write("\n");
      out.write("                    No database information available.\n");
      out.write("                ");
 } 
      out.write("\n");
      out.write("            </p>\n");
      out.write("\n");
      out.write("            <h4>Memory Information</h4>\n");
      out.write("            <p>\n");
      out.write("            ");

                MemoryInfo memoryInfo = sysInfoService.getMemoryInfo();
                if (memoryInfo != null) { 
      out.write("\n");
      out.write("                Maximum Heap: ");
      out.print( memoryInfo.getMaxHeap().megabytes() );
      out.write(" MB<br>\n");
      out.write("                Allocated Heap: ");
      out.print( memoryInfo.getAllocatedHeap().megabytes() );
      out.write(" MB<br>\n");
      out.write("                Used Memory: ");
      out.print( memoryInfo.getUsedHeap().megabytes() );
      out.write(" MB<br>\n");
      out.write("                Unused Allocated Memory: ");
      out.print( memoryInfo.getFreeAllocatedHeap().megabytes() );
      out.write(" MB<br>\n");
      out.write("                Available Memory: ");
      out.print( memoryInfo.getAvailableHeap().megabytes() );
      out.write(" MB<br>\n");
      out.write("            ");
 } else { 
      out.write("\n");
      out.write("                No memory information available.\n");
      out.write("            ");
	} 
      out.write("\n");
      out.write("            </p>\n");
      out.write("\n");
      out.write("            <h4>System Information</h4>\n");
      out.write("            <p>\n");
      out.write("            ");

                    Map sysinfo = GeneralUtil.convertBeanToMap(sysInfoService.getSystemProperties());
                    for (Iterator it = sysinfo.entrySet().iterator(); it.hasNext();)
                    {
                        Map.Entry entry = (Map.Entry) it.next();
                    
      out.write("\n");
      out.write("                        ");
      out.print( entry.getKey() );
      out.write(':');
      out.write(' ');
      out.print( entry.getValue() );
      out.write("<br>\n");
      out.write("            ");
      } 
      out.write("\n");
      out.write("            </p>\n");
      out.write("\n");
      out.write("            ");
 if (BootstrapUtils.getBootstrapManager().getHibernateConfig().isHibernateSetup()) {
      out.write("\n");
      out.write("                <h4>Cluster Information</h4>\n");
      out.write("                ");
 try { 
      out.write("\n");
      out.write("                    ");
 ClusterManager clusterManager = (ClusterManager) ContainerManager.getComponent("clusterManager"); 
      out.write("\n");
      out.write("                    ");
 if (!clusterManager.isClustered()) { 
      out.write("\n");
      out.write("                            <p>Not clustered.</p>\n");
      out.write("                    ");
 } else { 
      out.write("\n");
      out.write("                        ");
 ClusterInformation clusterInformation = clusterManager.getClusterInformation(); 
      out.write("\n");
      out.write("                        <p>\n");
      out.write("                            Name: ");
      out.print( HtmlUtil.htmlEncode(clusterInformation.getName()));
      out.write(" <br>\n");
      out.write("                            Description: ");
      out.print( HtmlUtil.htmlEncode(clusterInformation.getDescription()));
      out.write(" <br>\n");
      out.write("                            Members:<br>\n");
      out.write("                            ");

                                for (Iterator it = clusterInformation.getMembers().iterator(); it.hasNext();)
                                {
                            
      out.write("\n");
      out.write("                                    - ");
      out.print( HtmlUtil.htmlEncode(String.valueOf(it.next())) );
      out.write("<br>\n");
      out.write("                            ");
  } 
      out.write("\n");
      out.write("                        </p>\n");
      out.write("                   ");
 } 
      out.write("\n");
      out.write("                ");
 } catch (Throwable t) { 
      out.write("\n");
      out.write("                    <p>Error reporting cluster information: ");
      out.print( HtmlUtil.htmlEncode(t.toString()) );
      out.write("</p>\n");
      out.write("                ");
 } 
      out.write("\n");
      out.write("            ");
 } 
      out.write("\n");
      out.write("\n");
      out.write("            <h3>Plugins</h3>\n");
      out.write("            <ul class=\"plugins\">\n");
      out.write("            ");
  if (confluenceInfo != null) {
                    DateFormat format = DateFormat.getDateInstance(DateFormat.MEDIUM, Locale.US);
                    try
                    {
                        for (Iterator it = confluenceInfo.getEnabledPlugins().iterator(); it.hasNext();)
                        {
                            Plugin plugin = (Plugin) it.next();
                            PluginInformation pluginInfo = plugin.getPluginInformation();
                            String pluginName = plugin.getName();
                            String pluginKey = plugin.getKey();
                            String pluginVersion = pluginInfo == null ? "N/A" : pluginInfo.getVersion();
                            if (pluginVersion == null) // sometimes the version isn't defined by the plugin
                                pluginVersion = "N/A";

                            String lastModifiedStr = pluginDataDao == null ? "unknown" : "bundled";
                            if (pluginDataDao != null && pluginDataDao.pluginDataExists(pluginKey))
                            {
                                PluginDataWithoutBinary pluginData = pluginDataDao.getPluginDataWithoutBinary(pluginKey);
                                Date lastModified = pluginData != null ? pluginData.getLastModificationDate() : null;
                                if (lastModified != null)
                                {
                                    lastModifiedStr = format.format(lastModified);
                                }
                            }
            
      out.write("\n");
      out.write("                            <li>");
      out.print( HtmlUtil.htmlEncode(pluginName) );
      out.write(' ');
      out.write('(');
      out.print( HtmlUtil.htmlEncode(pluginKey) );
      out.write(", Version: ");
      out.print( pluginVersion );
      out.write(", Installed: ");
      out.print( lastModifiedStr );
      out.write(") </li>\n");
      out.write("            ");
          }
                    } catch (Exception e) { 
      out.write("\n");
      out.write("                        <li>Error retrieving plugin information: ");
      out.print( HtmlUtil.htmlEncode(e.toString()) );
      out.write("</li>\n");
      out.write("            ");
      }
                } else { 
      out.write("\n");
      out.write("                    <li>No plugin information available.</li>\n");
      out.write("            ");
  } 
      out.write("\n");
      out.write("            </ul>\n");
      out.write("\n");
      out.write("            <h3>Request</h3>\n");
      out.write("            ");

                try {
            
      out.write("\n");
      out.write("            <h4>Information</h4>\n");
      out.write("            <dl>\n");
      out.write("                <dt>URL</dt><dd>");
      out.print( HtmlUtil.htmlEncode(request.getRequestURL().toString()) );
      out.write("\n");
      out.write("                <dt>URI</dt><dd>");
      out.print( HtmlUtil.htmlEncode(request.getRequestURI()) );
      out.write("\n");
      out.write("                <dt>Context Path</dt><dd>");
      out.print( request.getContextPath() );
      out.write("</dd>\n");
      out.write("                <dt>Servlet Path</dt><dd>");
      out.print( request.getServletPath() );
      out.write("</dd>\n");
      out.write("                ");
 if (StringUtils.isNotBlank(request.getPathInfo())) { 
      out.write("\n");
      out.write("                    <dt>Path Info</dt><dd>");
      out.print( HtmlUtil.htmlEncode(request.getPathInfo()) );
      out.write("</dd>\n");
      out.write("                ");
 } 
      out.write("\n");
      out.write("                ");
 if (StringUtils.isNotBlank(request.getQueryString())) { 
      out.write("\n");
      out.write("                <dt>Query String</dt><dd>");
      out.print( HtmlUtil.htmlEncode(request.getQueryString()) );
      out.write("</dd>\n");
      out.write("                ");
 } 
      out.write("\n");
      out.write("            </dl>\n");
      out.write("            <h4>Headers (Limited subset)</h4>\n");
      out.write("            <dl>\n");
      out.write("            ");

                String[] headers = new String[]{"host", "x-forwarded-for", "user-agent", "keep-alive",
                    "connection", "cache-control", "if-modified-since", "if-none-match"};
                for (int i = 0; i < headers.length; i++)
                {
                    String name = headers[i];
                    Enumeration headerValues = request.getHeaders(name);
                    if (headerValues == null || !headerValues.hasMoreElements()) continue;
            
      out.write("\n");
      out.write("                    <dt>");
      out.print( HtmlUtil.htmlEncode(name) );
      out.write("</dt>\n");
      out.write("            ");

                    while (headerValues.hasMoreElements())
                    {
            
      out.write("\n");
      out.write("                    <dd>");
      out.print( HtmlUtil.htmlEncode(String.valueOf(headerValues.nextElement())));
      out.write("</dd>\n");
      out.write("            ");

                    }
                }
            
      out.write("\n");
      out.write("            </dl>\n");
      out.write("            <h4>Attributes</h4>\n");
      out.write("            <dl>\n");
      out.write("            ");

                for (Enumeration attributeNames = request.getAttributeNames(); attributeNames.hasMoreElements();)
                {
                    String name = String.valueOf(attributeNames.nextElement());
                
      out.write("\n");
      out.write("                    <dt>");
      out.print( HtmlUtil.htmlEncode(name) );
      out.write("</dt>\n");
      out.write("                    <dd>");
      out.print( HtmlUtil.htmlEncode(String.valueOf(request.getAttribute(name))));
      out.write("</dd>\n");
      out.write("                ");

                }
            
      out.write("\n");
      out.write("            </dl>\n");
      out.write("            <h4>Parameters (Limited subset)</h4>\n");
      out.write("            <dl>\n");
      out.write("            ");

                for (Enumeration parameterNames = request.getParameterNames(); parameterNames.hasMoreElements();)
                {
                    String name = String.valueOf(parameterNames.nextElement());
                    if (name.contains("pass")) continue;
                
      out.write("\n");
      out.write("                <dt>");
      out.print( HtmlUtil.htmlEncode(name) );
      out.write("</dt>\n");
      out.write("                ");

                    String[] parameterValues = request.getParameterValues(name);
                    for (int i = 0; i < parameterValues.length; i++)
                    {
                        
      out.write("\n");
      out.write("                        <dd>");
      out.print( HtmlUtil.htmlEncode(parameterValues[i]) );
      out.write("</dd>\n");
      out.write("                        ");

                    }
                }
            
      out.write("\n");
      out.write("            </dl>\n");
      out.write("            <h3>Confluence User</h3>\n");
      out.write("            ");

                Object loggedInValue = session.getAttribute(DefaultAuthenticator.LOGGED_IN_KEY);
                String username;
                if (loggedInValue instanceof Principal)
                {
                    username = ((Principal)loggedInValue).getName();
                }
                else
                {
                    username = "unknown";
                }
            
      out.write("\n");
      out.write("            <p>\n");
      out.write("                ");
      out.print( username );
      out.write("\n");
      out.write("            </p>\n");
      out.write("\n");
      out.write("            ");

                }
                catch (Throwable t)
                {
                    out.println("Error rendering logging information - uh oh.");
                    if (ConfluenceSystemProperties.isDevMode()) {
                        t.printStackTrace(new PrintWriter(out));
                    }
                }
            
      out.write("\n");
      out.write("\n");
      out.write("        ");
  List events = ThreadLocalErrorCollection.getList();
            if (events != null && !events.isEmpty()) { 
      out.write("\n");
      out.write("            <h3>Logging:</h3>\n");
      out.write("            ");
  try { 
      out.write("\n");
      out.write("                <p>");
      out.print( events.size() );
      out.write(" log statements generated by this request:</p>\n");
      out.write("                ");

                    for (Iterator it = events.iterator(); it.hasNext();)
                    {
                        Object event = it.next();
                        if (event instanceof DatedLoggingEvent) {
                            DatedLoggingEvent dle = (DatedLoggingEvent) event;
                            LoggingEvent loggingEvent = dle.getEvent();
                            Date date = dle.getDate();
                    
      out.write("\n");
      out.write("                        <div class=\"logStatement\">\n");
      out.write("                            <em class=\"bad\">[");
      out.print( HtmlUtil.htmlEncode(loggingEvent.getLevel().toString()) );
      out.write("]</em>\n");
      out.write("                            ");
      out.print( HtmlUtil.htmlEncode(date.toString()) );
      out.write("\n");
      out.write("                            [");
      out.print( HtmlUtil.htmlEncode(loggingEvent.getLoggerName()) );
      out.write("]\n");
      out.write("                            ");
      out.print( HtmlUtil.htmlEncode(loggingEvent.getRenderedMessage()) );
      out.write("\n");
      out.write("                            <br>\n");
      out.write("                            ");
 if (loggingEvent.getThrowableInformation() != null) { 
      out.write("\n");
      out.write("                                <div class=\"logThrowable\">\n");
      out.write("                                    <strong>Throwable:</strong><br>\n");
      out.write("                                    ");

                                        for (int i = 0; i < loggingEvent.getThrowableStrRep().length && i < 20; i++)
                                        {
                                            String s = loggingEvent.getThrowableStrRep()[i];
                                            out.println("" + HtmlUtil.htmlEncode(s) + "<br>");
                                        }
                                    
      out.write("\n");
      out.write("                                </div>\n");
      out.write("                        ");
 } 
      out.write("\n");
      out.write("                        </div>\n");
      out.write("                    ");
} else { 
      out.write("\n");
      out.write("                        ");
      out.print( HtmlUtil.htmlEncode(event.getClass().toString()) );
      out.write(':');
      out.write(' ');
      out.print( HtmlUtil.htmlEncode(event.toString()) );
      out.write("\n");
      out.write("                    ");
 } 
      out.write("\n");
      out.write("                ");
 } 
      out.write("\n");
      out.write("            ");
 } catch (Throwable t) { 
      out.write("\n");
      out.write("                <div class=\"error\">\n");
      out.write("                    <div class=\"errorMessage\" style=\"font-weight: bold;\">Error rendering logging information - uh oh.</div>\n");
      out.write("                    <pre>\n");
      out.write("                        ");
 if (ConfluenceSystemProperties.isDevMode())
                            t.printStackTrace(new PrintWriter(out));
                        
      out.write("\n");
      out.write("                        </pre>\n");
      out.write("                </div>\n");
      out.write("            ");
 } 
      out.write("\n");
      out.write("        ");
 } 
      out.write("\n");
      out.write("    ");
 } 
      out.write("\n");
      out.write("</div>\n");
      out.write("</body>\n");
      out.write("</html>\n");

    }
    finally
    {
        out.flush();
    }

      out.write('\n');
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
