import{_ as k,S as m}from"./index.632b0bf4.js";import{j as p,o as t,b as o,r as u,z as f,s as v,i as c,k as _,w as C,F as P,q as w,t as n,n as g,T as b}from"./vendor.dfe6942c.js";const y={components:{Scroll:m},emits:["choose"],props:{range:Array,disabled:Boolean},data(){return{show:!1,hide:!1}},methods:{showPicker(){!this.disabled&&this.range.length&&!this.timer&&(this.show=!0)},hidePicker(e){this.hide=!0,this.timer=setTimeout(()=>{this.show=!1,this.hide=!1,this.timer=null,e&&e()},110)},choose(e){this.hidePicker(()=>{this.$emit("choose",e)})}}},B={class:"c-picker-main"},S=["onClick"];function x(e,s,d,j,a,i){const h=p("Scroll");return t(),o("div",{class:"c-picker",onClick:s[2]||(s[2]=(...r)=>i.showPicker&&i.showPicker(...r))},[u(e.$slots,"default"),(t(),f(b,{to:"#app"},[a.show?(t(),o("div",{key:0,class:v(["c-picker-box",{hide:a.hide}])},[c("div",{class:"c-picker-bg",onClick:s[0]||(s[0]=r=>i.hidePicker())}),c("div",B,[_(h,{class:"c-picker-scroll",y:"",hideBar:""},{default:C(()=>[(t(!0),o(P,null,w(d.range,(r,l)=>(t(),o("div",{class:"c-picker-item",onClick:N=>i.choose(l),key:l},n(r),9,S))),128))]),_:1}),c("div",{class:"c-picker-item",onClick:s[1]||(s[1]=r=>i.hidePicker())},n(e.$t("btn.Canc")),1)])],2)):g("",!0)]))])}var z=k(y,[["render",x]]);export{z as P};