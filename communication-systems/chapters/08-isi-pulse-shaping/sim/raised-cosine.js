/* Raised Cosine Filter — Chapter 8 Sim 2 */
(function(){
  let chartTime,chartFreq;
  function init(){
    const et=document.getElementById('rc-time-chart');const ef=document.getElementById('rc-freq-chart');
    if(!et||!ef)return;buildCharts(et,ef);bindControls();
  }
  function rcTime(t,alpha){
    if(Math.abs(t)<1e-10)return 1;
    if(alpha>0&&Math.abs(Math.abs(2*alpha*t)-1)<1e-10)return(Math.PI/4)*sinc(1/(2*alpha));
    return sinc(t)*Math.cos(Math.PI*alpha*t)/(1-Math.pow(2*alpha*t,2));
  }
  function rcFreq(f,alpha,Tb){
    const T=Tb;const af=Math.abs(f);
    if(af<=(1-alpha)/(2*T))return T;
    if(af<=(1+alpha)/(2*T))return T/2*(1+Math.cos(Math.PI*T/alpha*(af-(1-alpha)/(2*T))));
    return 0;
  }
  function buildCharts(et,ef){
    const alphas=[0,0.25,0.5,0.75,1];
    const colors=['#38bdf8','#2dd4bf','#fbbf24','#fb7185','#a78bfa'];
    const N=400;
    // Time domain
    const tLabels=[];const tData=alphas.map(()=>[]);
    for(let i=0;i<=N;i++){const t=-4+8*i/N;tLabels.push(t.toFixed(2));
      alphas.forEach(function(a,j){tData[j].push(rcTime(t,a));});}
    chartTime=new Chart(et,{type:'line',data:{labels:tLabels,datasets:alphas.map(function(a,j){return{label:'α='+a,data:tData[j],borderColor:colors[j],borderWidth:1.5,pointRadius:0,fill:false};})},
      options:{responsive:true,maintainAspectRatio:false,animation:false,scales:{x:{title:{display:true,text:'t/Tb',color:'#94a3b8'},ticks:{color:'#94a3b8',maxTicksLimit:10},grid:{color:'#1e2d4a'}},y:{title:{display:true,text:'p(t)',color:'#94a3b8'},ticks:{color:'#94a3b8'},grid:{color:'#1e2d4a'},min:-0.4,max:1.2}},plugins:{legend:{labels:{color:'#e2e8f0'}}}}});
    // Freq domain
    const fLabels=[];const fData=alphas.map(()=>[]);
    for(let i=0;i<=N;i++){const f=i*1.5/N;fLabels.push(f.toFixed(2));
      alphas.forEach(function(a,j){fData[j].push(rcFreq(f,a,1));});}
    chartFreq=new Chart(ef,{type:'line',data:{labels:fLabels,datasets:alphas.map(function(a,j){return{label:'α='+a,data:fData[j],borderColor:colors[j],borderWidth:1.5,pointRadius:0,fill:false};})},
      options:{responsive:true,maintainAspectRatio:false,animation:false,scales:{x:{title:{display:true,text:'f·Tb',color:'#94a3b8'},ticks:{color:'#94a3b8',maxTicksLimit:10},grid:{color:'#1e2d4a'}},y:{title:{display:true,text:'|H(f)|',color:'#94a3b8'},ticks:{color:'#94a3b8'},grid:{color:'#1e2d4a'}}},plugins:{legend:{labels:{color:'#e2e8f0'}}}}});
  }
  function bindControls(){}
  document.addEventListener('DOMContentLoaded',init);
})();
