var R=Object.defineProperty,A=Object.defineProperties;var T=Object.getOwnPropertyDescriptors;var C=Object.getOwnPropertySymbols;var U=Object.prototype.hasOwnProperty,j=Object.prototype.propertyIsEnumerable;var B=(e,l,i)=>l in e?R(e,l,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[l]=i,w=(e,l)=>{for(var i in l||(l={}))U.call(l,i)&&B(e,i,l[i]);if(C)for(var i of C(l))j.call(l,i)&&B(e,i,l[i]);return e},L=(e,l)=>A(e,T(l));import{_ as h,a as N,S as E}from"./index.101c31c3.js";import{u as P,p as m,C as S,o as r,b as d,F as y,t as v,q as b,s as k,n as p,i as f,x as F,j as M,r as H,z as x,k as V,w as z,T as q}from"./vendor.dfe6942c.js";const D={emits:["update:value"],props:{value:Array,single:Boolean},setup(e,{emit:l}){const i=P(),t=m(null),s=m({});S(()=>e.value,n=>{s.value={},n.forEach(a=>s.value[a.uuid]=1)},{immediate:!0}),N.cruise.list({sn:i.state.sn}).then(n=>{t.value=n.cruise_list}).catch(n=>alert(n.message));function o(n){if(e.single)return l("update:value",[n]);if(s.value[n.uuid])return l("update:value",e.value.filter(a=>a.uuid!==n.uuid));l("update:value",[...e.value,n])}return{list:t,valueMap:s,selected:o}}},I=["onClick"];function O(e,l,i,t,s,o){return r(),d("div",{class:k(["c-routelist",{"c-routelist-load":!t.list}])},[t.list?(r(),d(y,{key:0},[t.list.length?(r(!0),d(y,{key:1},b(t.list,(n,a)=>(r(),d("div",{class:k(["c-routelist-item",{active:t.valueMap[n.uuid]}]),key:a,onClick:c=>t.selected(n)},v(n.name),11,I))),128)):(r(),d("div",{key:0,class:"c-routelist-empty",onClick:l[0]||(l[0]=n=>e.$router.push({name:"MapTask"}))},v(e.$t("sc.NRSe")),1))],64)):p("",!0)],2)}var W=h(D,[["render",O]]);const G={emits:["update:value"],props:{value:Array,single:Boolean,limitMap:[Boolean,String]},setup(e,{emit:l}){const i=P(),t=m(null),s=m({}),o=m(e.limitMap?typeof e.limitMap=="string"?e.limitMap:"":!1);S(()=>e.value,a=>{s.value={},a.forEach(c=>s.value[c.uuid]=1),e.limitMap?typeof e.limitMap=="string"?o.value=e.limitMap:a.length?o.value=a[0].mapUuid:o.value="":o.value=!1},{immediate:!0}),N.map.list({sn:i.state.sn}).then(({map_list:a})=>{t.value=a.filter(c=>c.point_list.length>0)}).catch(a=>alert(a.message));function n(a,c){if(!s.value[a.uuid]&&o.value!==!1&&o.value&&o.value!==c.uuid)return;const u=L(w({},a),{mapUuid:c.uuid,mapName:c.name});if(e.single)return l("update:value",[u]);if(s.value[a.uuid])return l("update:value",e.value.filter(g=>g.uuid!==u.uuid));l("update:value",[...e.value,u])}return{list:t,valueMap:s,limit:o,selected:n}}},J={class:"c-pointlist-name"},K=["onClick"];function Q(e,l,i,t,s,o){return r(),d("div",{class:k(["c-pointlist",{"c-pointlist-load":!t.list}])},[t.list?(r(),d(y,{key:0},[t.list.length?(r(!0),d(y,{key:1},b(t.list,(n,a)=>(r(),d("div",{class:k(["c-pointlist-map",{disabled:t.limit!==!1&&t.limit&&t.limit!==n.uuid}]),key:a},[f("div",J,v(n.name),1),(r(!0),d(y,null,b(n.point_list,(c,u)=>(r(),d("div",{class:k(["c-pointlist-item",{active:t.valueMap[c.uuid]}]),key:u,onClick:g=>t.selected(c,n)},v(c.name),11,K))),128))],2))),128)):(r(),d("div",{key:0,class:"c-pointlist-empty",onClick:l[0]||(l[0]=n=>e.$router.push({name:"MapIndex"}))},v(e.$t("sc.NWSe")),1))],64)):p("",!0)],2)}var X=h(G,[["render",Q]]);const Y={components:{Scroll:E,RouteList:W,PointList:X},emits:["choose"],props:{type:String,value:Array,title:String,single:Boolean,limitMap:[Boolean,String]},setup(e,{emit:l}){const i=m(!1),t=m(!1),s=m([]),o=m([]),n=F(()=>e.single?0:s.value.length||o.value.length);S(()=>e.value,_=>{if(!(!_||!(_ instanceof Array))){if(e.type==="route")return s.value=_;if(e.type==="point")return o.value=_}},{immediate:!0});let a=null;function c(){a||(i.value=!0)}function u(_){t.value=!0,a=setTimeout(()=>{i.value=!1,t.value=!1,a=null,_ instanceof Function&&_()},110)}function g(){u(()=>{switch(e.type){case"route":l("choose",s.value.length?s.value:null);break;case"point":l("choose",o.value.length?o.value:null);break}})}return{show:i,hide:t,routeSelected:s,pointSelected:o,selectedNum:n,onShow:c,onHide:u,onConfirm:g}}},Z=f("div",{class:"c-pickerbox-bg"},null,-1),$={class:"c-pickerbox-main"},ee={class:"c-pickerbox-head"},te={key:0,class:"c-pickerbox-shead"},le={class:"c-pickerbox-foot"};function ie(e,l,i,t,s,o){const n=M("RouteList"),a=M("PointList"),c=M("Scroll");return r(),d("div",{class:"c-pickerbox",onClick:l[4]||(l[4]=(...u)=>t.onShow&&t.onShow(...u))},[H(e.$slots,"default"),(r(),x(q,{to:"#app"},[t.show?(r(),d("div",{key:0,class:k(["c-pickerbox-box",{hide:t.hide}])},[Z,f("div",$,[f("div",ee,[f("div",null,v(i.title),1),t.selectedNum?(r(),d("div",te,v(e.$t("sc.Chos"))+"\uFF1A"+v(t.selectedNum),1)):p("",!0)]),V(c,{y:"",class:"c-pickerbox-scroll"},{default:z(()=>[i.type==="route"?(r(),x(n,{key:0,value:t.routeSelected,"onUpdate:value":l[0]||(l[0]=u=>t.routeSelected=u),single:i.single,limitMap:i.limitMap},null,8,["value","single","limitMap"])):p("",!0),i.type==="point"?(r(),x(a,{key:1,value:t.pointSelected,"onUpdate:value":l[1]||(l[1]=u=>t.pointSelected=u),single:i.single,limitMap:i.limitMap},null,8,["value","single","limitMap"])):p("",!0)]),_:1}),f("div",le,[f("div",{class:"c-pickerbox-btn c-pickerbox-cancel",onClick:l[2]||(l[2]=(...u)=>t.onHide&&t.onHide(...u))},v(e.$t("btn.Canc")),1),f("div",{class:"c-pickerbox-btn c-pickerbox-confirm",onClick:l[3]||(l[3]=(...u)=>t.onConfirm&&t.onConfirm(...u))},v(e.$t("btn.Ok")),1)])])],2)):p("",!0)]))])}var oe=h(Y,[["render",ie]]);export{oe as P};