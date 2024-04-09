:: -----------------------------------------------------------------------------------
:: See the CATALINA_OPTS below for tuning the JVM arguments used to start Confluence
:: -----------------------------------------------------------------------------------

echo "If you encounter issues starting up Confluence, please see the Installation guide at http://confluence.atlassian.com/display/DOC/Confluence+Installation+Guide"

:: Calculate offset to ..\logs directory
set atlassian_logsdir=%~dp0..\logs

:: IMPORTANT NOTE: Only set JAVA_HOME or JRE_HOME above this line
:: Get standard Java environment variables
if exist "%CATALINA_HOME%\bin\setjre.bat" goto setJre
echo Cannot find "%CATALINA_HOME%\bin\setjre.bat"
echo This file is needed to run this program
goto end
:setJre
call "%CATALINA_HOME%\bin\setjre.bat" %1
if errorlevel 1 goto end

echo "---------------------------------------------------------------------------"
echo "Using Java: %JRE_HOME%\bin\java.exe"
for /f %%i in ('"%JRE_HOME%\bin\java.exe" -jar %CATALINA_HOME%\bin\confluence-context-path-extractor.jar %CATALINA_HOME%') do set CONFLUENCE_CONTEXT_PATH=%%i
"%JRE_HOME%\bin\java.exe" -jar %CATALINA_HOME%\bin\synchrony-proxy-watchdog.jar %CATALINA_HOME%
echo "---------------------------------------------------------------------------"

:: -----------------------------------------------------------------------------------
:: This section contains commonly modified Java options and system properties
:: When upgrading Confluence, copy this section to reapply your customizations
:: Always the review the new file for any changes to the default values

:: To learn more about Java 11 options see:
:: https://docs.oracle.com/en/java/javase/11/tools/java.html
:: -----------------------------------------------------------------------------------

:: Set the Java heap size
set CATALINA_OPTS=-Xms1024m -Xmx1024m %CATALINA_OPTS%

:: Default values for small to medium size instances
set CATALINA_OPTS=-XX:ReservedCodeCacheSize=256m %CATALINA_OPTS%

:: Add various JPMS arguments to allow Confluence to work on Java 17
set CATALINA_OPTS="@%CATALINA_HOME%\confluence\WEB-INF\jpms-args.txt" %CATALINA_OPTS%

:: Default garbage collector and its settings
if "%CONFLUENCE_GC_OPTS%"=="" (
  set CONFLUENCE_GC_OPTS=-XX:G1ReservePercent=20 -XX:+UseG1GC -XX:+ExplicitGCInvokesConcurrent
)

:: Default garbage collector log
if "%CONFLUENCE_GC_LOG%"=="" (
  set CONFLUENCE_GC_LOG=-Xlog:gc*:file="%atlassian_logsdir%\gc-%%t.log":tags,time,uptime,level:filecount=5,filesize=2M
)

:: Recommended values for medium to large, and enterprise size instances
:: For -XX:ReservedCodeCacheSize - comment out the default values in the block above, then uncomment the values below
::set CATALINA_OPTS=-XX:ReservedCodeCacheSize=384m %CATALINA_OPTS%
:: To learn more about the impact of disabling the upgrade recovery file see:
:: https://confluence.atlassian.com/x/ShtwPg
::set CATALINA_OPTS=-Dconfluence.upgrade.recovery.file.enabled=false %CATALINA_OPTS%
:: For -Xlog:gc - uncomment the default values in the block below, then comment out the values in the last block of this file
::set CATALINA_OPTS=-Xlog:gc*=debug:file="%atlassian_logsdir%\gc-%%t.log":tags,time,uptime,level:filecount=5,filesize=2M %CATALINA_OPTS%

:: Additional Confluence system properties
:: For a list of properties recognized by Confluence see:
:: https://confluence.atlassian.com/display/DOC/Recognized+System+Properties
:: We recommend you include a support ticket ID and/or note to help track the reason for change
:: For example:
:: CSP-123456 - Added example JVM option to help explain this section
::CATALINA_OPTS="-Dexample.property=true %CATALINA_OPTS%"

:: Uncomment this line to disable email notifications
::set CATALINA_OPTS=-Datlassian.mail.senddisabled=true -Datlassian.mail.fetchdisabled=true %CATALINA_OPTS%

:: -----------------------------------------------------------------------------------
:: End of commonly modified Java options. You should not need to change the options
:: below unless recommended by Atlassian Support
:: -----------------------------------------------------------------------------------

set CATALINA_OPTS=-XX:+IgnoreUnrecognizedVMOptions %CATALINA_OPTS%
set CATALINA_OPTS=%CONFLUENCE_GC_OPTS% %CATALINA_OPTS%
set CATALINA_OPTS=%CONFLUENCE_GC_LOG% %CATALINA_OPTS%
set CATALINA_OPTS=-Djava.awt.headless=true %CATALINA_OPTS%
set CATALINA_OPTS=-Datlassian.plugins.enable.wait=300 %CATALINA_OPTS%
set CATALINA_OPTS=-Dsynchrony.enable.xhr.fallback=true %CATALINA_OPTS%
set CATALINA_OPTS=-Dconfluence.context.path=%CONFLUENCE_CONTEXT_PATH% %CATALINA_OPTS%
set CATALINA_OPTS=-Dorg.apache.tomcat.websocket.DEFAULT_BUFFER_SIZE=32768 %CATALINA_OPTS%
set CATALINA_OPTS=%START_CONFLUENCE_JAVA_OPTS% %CATALINA_OPTS%

:: -----------------------------------------------------------------------------------
::  End configuration options
:: -----------------------------------------------------------------------------------

:: Clean up temporary variables
set atlassian_logsdir=

:end
