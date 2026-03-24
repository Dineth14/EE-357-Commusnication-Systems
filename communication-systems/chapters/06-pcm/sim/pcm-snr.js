/* PCM SNR vs Bits — Chapter 6 Sim 3 */
(function(){
  let chart;
  function init(){const el=document.getElementById('pcm-snr-chart');if(!el)return;buildChart(el);bindControls();}
  function buildChart(el){
    const maxBits=16;const labels=[];const snrUniform=[];const snrMu=[];const snrA=[];
    const mu=255,A=87.6;
    for(let b=1;b<=maxBits;b++){labels.push(b);snrUniform.push(6.02*b+1.76);
      snrMu.push(6.02*b+1.76+10*Math.log10(3/(Math.log(1+mu)*Math.log(1+mu))));
      snrA.push(6.02*b+1.76+10*Math.log10(3/((1+Math.log(A))*(1+Math.log(A)))));
    }
    chart=new Chart(el,{type:'line',data:{labels:labels,datasets:[
      {label:'Uniform SQNR',data:snrUniform,borderColor:'#38bdf8',borderWidth:2,pointRadius:3,fill:false},
      {label:'μ-law (full load)',data:snrMu,borderColor:'#fbbf24',borderWidth:2,pointRadius:3,fill:false,borderDash:[6,3]},
      {label:'A-law (full load)',data:snrA,borderColor:'#2dd4bf',borderWidth:2,pointRadius:3,fill:false,borderDash:[3,3]}
    ]},options:{responsive:true,maintainAspectRatio:false,animation:false,scales:{x:{title:{display:true,text:'Bits per sample (B)',color:'#94a3b8'},ticks:{color:'#94a3b8'},grid:{color:'#1e2d4a'}},y:{title:{display:true,text:'SQNR (dB)',color:'#94a3b8'},ticks:{color:'#94a3b8'},grid:{color:'#1e2d4a'}}},plugins:{legend:{labels:{color:'#e2e8f0'}}}}});
  }
  function bindControls(){
    const highlight=document.getElementById('pcm-snr-bits');
    if(highlight)highlight.addEventListener('input',function(){
      const b=parseInt(highlight.value);document.getElementById('pcm-snr-bits-val').textContent=b;
      const snr=(6.02*b+1.76).toFixed(1);document.getElementById('pcm-snr-readout').textContent=snr+' dB';
    });
  }
  document.addEventListener('DOMContentLoaded',init);
})();
