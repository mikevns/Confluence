#-----------------------------------------------------------------------------------
# See the CATALINA_OPTS below for tuning the JVM arguments used to start Confluence
#-----------------------------------------------------------------------------------

echo "If you encounter issues starting up Confluence, please see the Installation guide at http://confluence.atlassian.com/display/DOC/Confluence+Installation+Guide"

# set the location of the pid file
if [ -z "$CATALINA_PID" ] ; then
    if [ -n "$CATALINA_BASE" ] ; then
        CATALINA_PID="$CATALINA_BASE"/work/catalina.pid
    elif [ -n "$CATALINA_HOME" ] ; then
        CATALINA_PID="$CATALINA_HOME"/work/catalina.pid
    fi
fi
export CATALINA_PID

PRGDIR=`dirname "$0"`
if [ -z "$CATALINA_BASE" ]; then
  if [ -z "$CATALINA_HOME" ]; then
    LOGBASE=$PRGDIR
    LOGTAIL=..
  else
    LOGBASE=$CATALINA_HOME
    LOGTAIL=.
  fi
else
  LOGBASE=$CATALINA_BASE
  LOGTAIL=.
fi

PUSHED_DIR=`pwd`
cd $LOGBASE
cd $LOGTAIL
LOGBASEABS=`pwd`
cd $PUSHED_DIR
echo ""
echo "Server startup logs are located in $LOGBASEABS/logs/catalina.out"

# IMPORTANT NOTE: Only set JAVA_HOME or JRE_HOME above this line
# Get standard Java environment variables
if $os400; then
  # -r will Only work on the os400 if the files are:
  # 1. owned by the user
  # 2. owned by the PRIMARY group of the user
  # this will not work if the user belongs in secondary groups
  . "$CATALINA_HOME"/bin/setjre.sh
else
  if [ -r "$CATALINA_HOME"/bin/setjre.sh ]; then
    . "$CATALINA_HOME"/bin/setjre.sh
  else
    echo "Cannot find $CATALINA_HOME/bin/setjre.sh"
    echo "This file is needed to run this program"
    exit 1
  fi
fi

echo "---------------------------------------------------------------------------"
echo "Using Java: $JRE_HOME/bin/java"
CONFLUENCE_CONTEXT_PATH=`$JRE_HOME/bin/java -jar $CATALINA_HOME/bin/confluence-context-path-extractor.jar $CATALINA_HOME`
export CONFLUENCE_CONTEXT_PATH
$JRE_HOME/bin/java -jar $CATALINA_HOME/bin/synchrony-proxy-watchdog.jar $CATALINA_HOME
echo "---------------------------------------------------------------------------"

#-----------------------------------------------------------------------------------
# This section contains commonly modified Java options and system properties
# When upgrading Confluence, copy this section to reapply your customizations
# Always the review the new file for any changes to the default values

# To learn more about Java 11 options see:
# https://docs.oracle.com/en/java/javase/11/tools/java.html
#-----------------------------------------------------------------------------------

# Set the Java heap size
CATALINA_OPTS="-Xms1024m -Xmx1024m ${CATALINA_OPTS}"

# Default values for small to medium size instances
CATALINA_OPTS="-XX:ReservedCodeCacheSize=256m ${CATALINA_OPTS}"

# Add various JPMS arguments to allow Confluence to work on Java 17
CATALINA_OPTS="@$CATALINA_HOME/confluence/WEB-INF/jpms-args.txt ${CATALINA_OPTS}"

# Default garbage collector and its settings
if [ -z "${CONFLUENCE_GC_OPTS}" ]; then
  CONFLUENCE_GC_OPTS="-XX:G1ReservePercent=20 -XX:+UseG1GC -XX:+ExplicitGCInvokesConcurrent"
fi

# Default garbage collector log
if [ -z "${CONFLUENCE_GC_LOG}" ]; then
  CONFLUENCE_GC_LOG="-Xlog:gc*:file=$LOGBASEABS/logs/gc-%t.log:tags,time,uptime,level:filecount=5,filesize=2M"
fi

# Recommended values for medium to large, and enterprise size instances
# For -XX:ReservedCodeCacheSize - comment out the default values in the block above, then uncomment the values below
#CATALINA_OPTS="-XX:ReservedCodeCacheSize=384m ${CATALINA_OPTS}"
# To learn more about the impact of disabling the upgrade recovery file see:
# https://confluence.atlassian.com/x/ShtwPg
#CATALINA_OPTS="-Dconfluence.upgrade.recovery.file.enabled=false ${CATALINA_OPTS}"
# For -Xlog:gc - uncomment the default values in the block below, then comment out the values in the last block of this file
#CATALINA_OPTS="-Xlog:gc*=debug:file=$LOGBASEABS/logs/gc-%t.log:tags,time,uptime,level:filecount=5,filesize=2M ${CATALINA_OPTS}"

# Additional Confluence system properties
# For a list of properties recognized by Confluence see:
# https://confluence.atlassian.com/display/DOC/Recognized+System+Properties
# We recommend you include a support ticket ID and/or note to help track the reason for change
# For example:
# CSP-123456 - Added example JVM option to help explain this section
#CATALINA_OPTS="-Dexample.property=true ${CATALINA_OPTS}"

# Uncomment this line to disable email notifications
#CATALINA_OPTS="-Datlassian.mail.senddisabled=true -Datlassian.mail.fetchdisabled=true ${CATALINA_OPTS}"

#-----------------------------------------------------------------------------------
# End of commonly modified Java options. You should not need to change the options
# below unless recommended by Atlassian Support
#-----------------------------------------------------------------------------------

CATALINA_OPTS="-XX:+IgnoreUnrecognizedVMOptions ${CATALINA_OPTS}"
CATALINA_OPTS="${CONFLUENCE_GC_OPTS} ${CATALINA_OPTS}"
CATALINA_OPTS="${CONFLUENCE_GC_LOG} ${CATALINA_OPTS}"
CATALINA_OPTS="-Djava.awt.headless=true ${CATALINA_OPTS}"
CATALINA_OPTS="-Datlassian.plugins.enable.wait=300 ${CATALINA_OPTS}"
CATALINA_OPTS="-Dsynchrony.enable.xhr.fallback=true ${CATALINA_OPTS}"
CATALINA_OPTS="-Dconfluence.context.path=${CONFLUENCE_CONTEXT_PATH} ${CATALINA_OPTS}"
CATALINA_OPTS="-Dorg.apache.tomcat.websocket.DEFAULT_BUFFER_SIZE=32768 ${CATALINA_OPTS}"
CATALINA_OPTS="${START_CONFLUENCE_JAVA_OPTS} ${CATALINA_OPTS}"

export CATALINA_OPTS

#-----------------------------------------------------------------------------------
# End configuration options
#-----------------------------------------------------------------------------------
