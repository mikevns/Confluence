define("confluence/custom-protocol-launcher",["document","confluence/api/logger"],function(b,c){return{openUri:function(d){var e=b.body,a;a=b.querySelector("#confluence_hiddenIframe");a||(a=b.createElement("iframe"),a.src="about:blank",a.id="confluence_hiddenIframe",a.style.display="none",e.appendChild(a));try{a.contentWindow.location.href=d}catch(f){c.log("Error while try to open URI"+f)}}}});