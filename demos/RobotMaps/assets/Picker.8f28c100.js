import{_ as k,S as m}from"./index.101c31c3.js";import{j as p,o as t,b as o,r as u,z as v,s as _,i as c,k as f,w as C,F as P,q as w,t as n,n as g,T as y}from"./vendor.dfe6942c.js";const B={components:{Scroll:m},emits:["choose"],props:{range:Array,disabled:Boolean},data(){return{show:!1,hide:!1}},methods:{showPicker(){!this.disabled&&this.range.length&&!this.timer&&(this.show=!0)},hidePicker(e){this.hide=!0,this.timer=setTimeout(()=>{this.show=!1,this.hide=!1,this.timer=null,e&&e()},110)},choose(e){this.hidePicker(()=>{this.$emit("choose",e)})}}},S={class:"c-picker-main"},b=["onClick"];function x(e,s,d,j,a,i){const h=p("Scroll");return t(),o("div",{class:"c-picker",onClick:s[2]||(s[2]=(...r)=>i.showPicker&&i.showPicker(...r))},[u(e.$slots,"default"),(t(),v(y,{to:"#app"},[a.show?(t(),o("div",{key:0,class:_(["c-picker-box",{hide:a.hide}])},[c("div",{class:"c-picker-bg",onClick:s[0]||(s[0]=r=>i.hidePicker())}),c("div",S,[f(h,{class:"c-picker-scroll",y:"",hideBar:""},{default:C(()=>[(t(!0),o(P,null,w(d.range,(r,l)=>(t(),o("div",{class:"c-picker-item",onClick:N=>i.choose(l),key:l},n(r),9,b))),128))]),_:1}),c("div",{class:"c-picker-item",onClick:s[1]||(s[1]=r=>i.hidePicker())},n(e.$t("btn.Canc")),1)])],2)):g("",!0)]))])}var z=k(B,[["render",x]]);export{z as P};