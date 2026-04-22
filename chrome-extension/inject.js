<script>
if((window.location.href.indexOf("location/MAK8IBLaQbsIQI9to8MD")!==-1||window.location.href.indexOf("location%2FMAK8IBLaQbsIQI9to8MD")!==-1||window.location.href.indexOf("location/iMCUQozpqGhUSJftqvNe")!==-1||window.location.href.indexOf("location%2FiMCUQozpqGhUSJftqvNe")!==-1)&&!document.getElementById("mojo-ticket-btn")){
var b=document.createElement("div");
b.id="mojo-ticket-btn";
b.style.cssText="position:fixed;bottom:24px;right:24px;width:56px;height:56px;min-width:56px;min-height:56px;max-width:56px;max-height:56px;background:#27241E;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:999999;box-shadow:0 4px 12px rgba(0,0,0,0.3);overflow:hidden;box-sizing:border-box;padding:0";
b.innerHTML='<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
document.body.appendChild(b);
var f=document.createElement("iframe");
f.id="mojo-ticket-iframe";
f.src="https://mojo-tickets-production.up.railway.app/embed";
f.style.cssText="position:fixed;bottom:96px;right:24px;width:380px;height:560px;border:none;border-radius:16px;z-index:999998;display:none;box-shadow:0 8px 30px rgba(0,0,0,0.2)";
document.body.appendChild(f);
var o=0;
b.onclick=function(){o=!o;f.style.display=o?"block":"none";b.innerHTML=o?'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>':'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'};
}
var link=document.createElement("link");
link.href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap";
link.rel="stylesheet";
document.head.appendChild(link);
var css=document.createElement("style");
css.textContent="#sidebar-v2 a:hover{background:#E5DAD0 !important;color:#27241E !important}#sidebar-v2 a{transition:background 0.2s !important}";
document.head.appendChild(css);
var pageBg="#FCF9F6";
var sidebarBg="#FCF9F6";
var activeLink="#E5DAD0";
var textDark="#27241E";
var textMuted="#6F634F";
var khaki="#BBAC9D";
function mojoStyle(){
var s=document.getElementById("sidebar-v2");if(s){s.style.setProperty("background",sidebarBg,"important");s.style.setProperty("border-right","1px solid #E5DAD0","important")}
document.querySelectorAll('.lead-connector').forEach(function(e){e.style.setProperty("background",sidebarBg,"important")});
document.querySelectorAll('.rounded-r-md').forEach(function(e){e.style.setProperty("background",sidebarBg,"important")});
document.querySelectorAll('#sidebar-v2 a, #sidebar-v2 span, #sidebar-v2 div').forEach(function(e){e.style.setProperty("color",textDark,"important")});
document.querySelectorAll('p.border-b.border-solid.my-3').forEach(function(e){e.style.setProperty("border-color","#E5DAD0","important");e.style.setProperty("opacity","0.3","important")});
document.querySelectorAll('#sidebar-v2 svg').forEach(function(e){e.style.setProperty("stroke",textMuted,"important")});
document.querySelectorAll('#sidebar-v2 img[src*="sidebar-v2"]').forEach(function(e){if(e.offsetWidth<=20&&e.offsetHeight<=20){e.style.setProperty("filter","brightness(0.3)","important")}});
document.querySelectorAll('#sidebar-v2 *').forEach(function(e){var bg=getComputedStyle(e).backgroundColor;if(bg==='rgb(75, 85, 99)'){e.style.setProperty("background",activeLink,"important");e.style.setProperty("color",textDark,"important")}if(bg==='rgb(6, 95, 70)'){e.style.setProperty("background",khaki,"important")}if(bg==='rgb(156, 163, 175)'){e.style.setProperty("background",khaki,"important");e.style.setProperty("color",textDark,"important")}if(bg==='rgb(26, 32, 44)'||bg==='rgb(73, 97, 91)'){e.style.setProperty("background",activeLink,"important");e.style.setProperty("color",textDark,"important")}});
document.querySelectorAll('#sidebar-v2 .active, #sidebar-v2 .exact-active').forEach(function(e){e.style.setProperty("background",activeLink,"important");e.style.setProperty("color",textDark,"important");e.style.setProperty("font-weight","700","important")});
document.querySelectorAll('*').forEach(function(e){if(e.innerText==='Go Back'&&e.offsetHeight<50){e.style.setProperty("background",sidebarBg,"important");e.style.setProperty("color",textMuted,"important");e.parentElement.style.setProperty("background",sidebarBg,"important")}});
document.querySelectorAll('*').forEach(function(e){if(e.textContent&&e.textContent.indexOf('Click here to switch')!==-1&&e.children.length===0){e.style.setProperty("background","transparent","important");e.style.setProperty("color",textMuted,"important")}});
document.querySelectorAll('#sidebar-v2 .cursor-pointer').forEach(function(e){if(e.textContent&&e.textContent.indexOf('MOJO')!==-1&&e.textContent.indexOf('switch')!==-1){e.style.setProperty("background","transparent","important");e.style.setProperty("border","1px solid "+activeLink,"important");e.style.setProperty("border-radius","8px","important");e.style.setProperty("margin","0 12px","important")}});
var logoContainer=document.querySelector('#sidebar-v2 .flex.items-center.justify-center.flex-shrink-0');
if(logoContainer&&!document.getElementById("mojo-logo-text")){
var logoImg=logoContainer.querySelector("img");if(logoImg)logoImg.style.setProperty("display","none","important");
var mojoLogo=document.createElement("img");
mojoLogo.id="mojo-logo-text";
mojoLogo.src="https://mojo-tickets-production.up.railway.app/mojo-logo.png";
mojoLogo.style.cssText="width:120px !important;height:auto !important;padding:12px 0 !important;display:block !important;margin:0 auto !important";
logoContainer.appendChild(mojoLogo);
logoContainer.style.setProperty("padding","8px 0","important")
}
document.querySelectorAll('.hl_header').forEach(function(e){e.style.setProperty("background","white","important");e.style.setProperty("border-bottom","1px solid #E5DAD0","important")});
var copilot=document.getElementById("hl_header--copilot-icon");if(copilot)copilot.style.setProperty("display","none","important");
document.querySelectorAll('.hl_header [class*=changelog]').forEach(function(e){e.style.setProperty("display","none","important")});
document.querySelectorAll('.dropdown-menu').forEach(function(e){e.style.setProperty("background","white","important");e.style.setProperty("border","1px solid #E5DAD0","important");e.style.setProperty("border-radius","12px","important");e.style.setProperty("box-shadow","0 4px 12px rgba(0,0,0,0.1)","important")});
document.querySelectorAll('.dropdown-menu *').forEach(function(e){e.style.setProperty("color",textDark,"important");e.style.setProperty("background","transparent","important")});
var ids=["location-dashboard","dashboard-wrapper","launchpad-micro-app","launchpad-app-v2","fc-calendar-container-v2","table-container"];
ids.forEach(function(id){var el=document.getElementById(id);if(el)el.style.setProperty("background",pageBg,"important")});
document.querySelectorAll('.hl_conversations--wrap,.hl_wrapper,.hr-wrapper-container,.opportunityPage,.notification-banner-wrapper,.bg-gray-50,.bg-gray-100,.hl_topbar-tabs').forEach(function(e){e.style.setProperty("background",pageBg,"important")});
document.body.style.setProperty("font-family","'DM Sans',sans-serif","important");
document.body.style.setProperty("background",pageBg,"important");
}
mojoStyle();
setInterval(mojoStyle,2000);
</script>