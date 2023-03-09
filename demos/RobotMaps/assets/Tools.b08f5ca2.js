var W=Object.defineProperty,E=Object.defineProperties;var L=Object.getOwnPropertyDescriptors;var C=Object.getOwnPropertySymbols;var N=Object.prototype.hasOwnProperty,P=Object.prototype.propertyIsEnumerable;var y=(s,e,n)=>e in s?W(s,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):s[e]=n,D=(s,e)=>{for(var n in e||(e={}))N.call(e,n)&&y(s,n,e[n]);if(C)for(var n of C(e))P.call(e,n)&&y(s,n,e[n]);return s},T=(s,e)=>E(s,L(e));import{_ as B,a as w}from"./index.101c31c3.js";import{S as O}from"./Switch.abb1be03.js";import{P as M}from"./Picker.8f28c100.js";import{v as V,u as A,p as h,j as b,o as c,b as v,k as u,F as $,q as U,w as q,i as t,t as r,n as F}from"./vendor.dfe6942c.js";import{t as J}from"./config.a973ab44.js";import{_ as H}from"./open.72cf3b93.js";const I={components:{Switch:O,Picker:M},setup(){var R,S;const{t:s}=V(),e=A(),n=h({high:0,medium:1,low:2}[((S=(R=e.state.robot)==null?void 0:R.status)==null?void 0:S.moving_speed)||"high"]||0),o={leds_blue:h(0),leds_uv:h(0),drawer_top:h(0),drawer_bottom:h(0)},f=Object.keys(o),k=window.loading(s("top.LDSt"));w.device.query({sn:e.state.sn,name:f.join(",")}).then(({data:l})=>{f.forEach(i=>o[i].value=l[i])}).finally(()=>k.remove());function p(l){const i=window.loading(),d=o[l].value?0:1;w.device.change({sn:e.state.sn,name:l,value:d}).then(()=>{o[l].value=d}).catch(j=>alert(j.message)).finally(()=>i.remove())}function _(l){const i=window.loading();w.move.speed({sn:e.state.sn,speed:["high","medium","low"][l]}).then(()=>{n.value=l}).catch(d=>alert(d.message)).finally(()=>i.remove())}function g(){window.modal({title:s("top.Warn"),content:s("top.WTRC"),success:({confirm:l})=>{if(!l)return;const i=window.loading();w.robot.reboot({sn:e.state.sn}).catch(d=>alert(d.message)).finally(()=>i.remove())}})}function a(){window.modal({title:s("top.Warn"),content:s("top.WTRS"),success:({confirm:l})=>{if(!l)return;const i=window.loading();w.robot.softReset({sn:e.state.sn}).catch(d=>alert(d.message)).finally(()=>i.remove())}})}function m(){window.modal({title:s("top.Warn"),content:s("top.WTRS"),success:({confirm:l})=>{if(!l)return;const i=window.loading();w.robot.hardReset({sn:e.state.sn}).catch(d=>alert(d.message)).finally(()=>i.remove())}})}return T(D({},o),{speed:n,toolsMenu:J,switchDevice:p,speedChoose:_,reboot:g,softReset:a,hardReset:m})}},K={class:"v-sc-tools"},Y={key:0,class:"row"},z={class:"name"},G={class:"value"},Q={key:1,class:"row"},X={class:"name"},Z={class:"value"},x={key:2,class:"row"},ss={class:"name"},es={class:"value"},os={key:3,class:"row"},ts={class:"name"},ns={class:"value"},as={key:4,class:"row"},ls={class:"name"},is={class:"value"},ds={class:"name"},rs={class:"value"},cs={class:"select-btn"},vs={class:"select-name"},_s=t("img",{class:"select-icon",src:H,alt:"\u2193"},null,-1),us={class:"name"},ms={class:"name"},ws={class:"name"};function hs(s,e,n,o,f,k){const p=b("Navbar"),_=b("Switch"),g=b("Picker");return c(),v("div",K,[u(p,{class:"navbar",title:s.$t("all.DeTo")},null,8,["title"]),(c(!0),v($,null,U(o.toolsMenu[s.$store.state.snst]||o.toolsMenu[s.$store.state.snt]||[],a=>(c(),v($,{key:a},[a==="SPRAY"?(c(),v("div",Y,[t("div",z,r(s.$t("sc.Spra")),1),t("div",G,[u(_,{value:s.leds_uv,onClick:e[0]||(e[0]=m=>o.switchDevice("leds_uv"))},null,8,["value"])])])):a==="LED_UVC"?(c(),v("div",Q,[t("div",X,r(s.$t("sc.UVCL")),1),t("div",Z,[u(_,{value:s.leds_uv,onClick:e[1]||(e[1]=m=>o.switchDevice("leds_uv"))},null,8,["value"])])])):a==="LED_BLUE"?(c(),v("div",x,[t("div",ss,r(s.$t("sc.WaLi")),1),t("div",es,[u(_,{value:s.leds_blue,onClick:e[2]||(e[2]=m=>o.switchDevice("leds_blue"))},null,8,["value"])])])):a==="DRAWER_TOP"?(c(),v("div",os,[t("div",ts,r(s.$t("sd.ToDr")),1),t("div",ns,[u(_,{value:s.drawer_top,onClick:e[3]||(e[3]=m=>o.switchDevice("drawer_top"))},null,8,["value"])])])):a==="DRAWER_BOTTOM"?(c(),v("div",as,[t("div",ls,r(s.$t("sd.BoDr")),1),t("div",is,[u(_,{value:s.drawer_bottom,onClick:e[4]||(e[4]=m=>o.switchDevice("drawer_bottom"))},null,8,["value"])])])):F("",!0)],64))),128)),u(g,{class:"row",range:JSON.parse(s.$t("all.$Spe")),onChoose:o.speedChoose},{default:q(()=>[t("div",ds,r(s.$t("all.MoSp")),1),t("div",rs,[t("div",cs,[t("span",vs,r(JSON.parse(s.$t("all.$Spe"))[o.speed]),1),_s])])]),_:1},8,["range","onChoose"]),t("div",{class:"row",onClick:e[5]||(e[5]=(...a)=>o.reboot&&o.reboot(...a))},[t("div",us,r(s.$t("all.ReSy")),1)]),t("div",{class:"row",onClick:e[6]||(e[6]=(...a)=>o.softReset&&o.softReset(...a))},[t("div",ms,r(s.$t("all.SoRe")),1)]),t("div",{class:"row",onClick:e[7]||(e[7]=(...a)=>o.hardReset&&o.hardReset(...a))},[t("div",ws,r(s.$t("all.HaRe")),1)])])}var Cs=B(I,[["render",hs]]);export{Cs as default};
