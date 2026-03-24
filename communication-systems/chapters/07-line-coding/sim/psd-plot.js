/* PSD Plot for Line Codes — Chapter 7 Sim 2 */
(function(){
  let chart;
  function init(){const el=document.getElementById('psd-chart');if(!el)return;buildChart(el);bindControls();}
  function nrzlPSD(f,Tb){const x=f*Tb;if(Math.abs(x)<1e-10)return Tb;return Tb*Math.pow(sinc(x),2);}
  function manchesterPSD(f,Tb){const x=f*Tb;if(Math.abs(x)<1e-10)return 0;return Tb*Math.pow(sinc(x/2)*Math.sin(Math.PI*x/2),2);}
  function amiPSD(f,Tb){const x=f*Tb;if(Math.abs(x)<1e-10)return 0;return Tb*Math.pow(sinc(x),2)*Math.pow(Math.sin(Math.PI*x),2);}
  function buildChart(el){
    const Tb=1;const N=300;const labels=[];const nrzl=[];const manch=[];const ami=[];
    for(let i=0;i<=N;i++){const f=i*3/N;labels.push(f.toFixed(2));
      nrzl.push(nrzlPSD(f,Tb));manch.push(manchesterPSD(f,Tb));ami.push(amiPSD(f,Tb));}
    chart=new Chart(el,{type:'line',data:{labels:labels,datasets:[
      {label:'NRZ-L',data:nrzl,borderColor:'#38bdf8',borderWidth:2,pointRadius:0,fill:false},
      {label:'Manchester',data:manch,borderColor:'#2dd4bf',borderWidth:2,pointRadius:0,fill:false},
      {label:'AMI',data:ami,borderColor:'#fbbf24',borderWidth:2,pointRadius:0,fill:false}
    ]},options:{responsive:true,maintainAspectRatio:false,animation:false,
      scales:{x:{title:{display:true,text:'f · Tb',color:'#94a3b8'},ticks:{color:'#94a3b8',maxTicksLimit:15},grid:{color:'#1e2d4a'}},
        y:{title:{display:true,text:'PSD (normalized)',color:'#94a3b8'},ticks:{color:'#94a3b8'},grid:{color:'#1e2d4a'}}},
      plugins:{legend:{labels:{color:'#e2e8f0'}}}}});
  }
  function bindControls(){
    document.querySelectorAll('.psd-toggle input[type="checkbox"]').forEach(function(cb,i){
      cb.addEventListener('change',function(){if(chart)chart.data.datasets[i].hidden=!cb.checked;chart.update('none');});
    });
  }
  document.addEventListener('DOMContentLoaded',init);
})();
