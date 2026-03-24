/* Reconstruction Simulator — Chapter 4 Sim 3 */
(function(){
  const st={fs:8,fm:1,filter:'ideal',playing:true,time:0,speed:1};
  let canvas,ctx,W,H,chart,last=0;
  function init(){
    canvas=document.getElementById('reconstruction-canvas');if(!canvas)return;
    ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();
    initChart();requestAnimationFrame(draw);
  }
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=280;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function msg(t){return Math.sin(2*Math.PI*st.fm*t)+0.4*Math.sin(2*Math.PI*1.7*st.fm*t);}

  function draw(ts){if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(st.playing)st.time+=dt*st.speed;
    ctx.clearRect(0,0,W,H);
    const mid=H/2,amp=H*0.35,dur=3/st.fm;
    ctx.strokeStyle='#334155';ctx.lineWidth=0.3;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText('Reconstructed (teal) vs Original (blue dashed)',8,14);
    // Original
    ctx.strokeStyle='rgba(56,189,248,0.4)';ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.beginPath();
    for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const y=mid-amp*msg(t);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.setLineDash([]);
    // Reconstructed
    const Ts=1/st.fs;const tStart=st.time;
    ctx.strokeStyle='#2dd4bf';ctx.lineWidth=2;ctx.beginPath();
    for(let x=0;x<W;x++){const t=tStart+(x/W)*dur;let y=0;
      for(let k=-30;k<=30;k++){const tn=Math.round(tStart*st.fs)/st.fs+k*Ts;
        const sv=msg(tn);const dt2=t-tn;
        if(st.filter==='ideal')y+=sv*sinc(dt2/Ts);
        else if(st.filter==='zoh')y+=(dt2>=0&&dt2<Ts)?sv:0;
        else{const frac=dt2/Ts;if(frac>=0&&frac<1)y+=sv*(1-frac);else if(frac>=-1&&frac<0)y+=sv*(1+frac);}
      }
      const py=mid-amp*y;if(x===0)ctx.moveTo(x,py);else ctx.lineTo(x,py);}ctx.stroke();
    // Error
    const errEl=document.getElementById('recon-error');
    if(errEl){let mse=0;const N=100;for(let i=0;i<N;i++){const t=tStart+(i/N)*dur;let r=0;
      for(let k=-30;k<=30;k++){const tn=Math.round(tStart*st.fs)/st.fs+k*Ts;const sv=msg(tn);const dt2=t-tn;
        if(st.filter==='ideal')r+=sv*sinc(dt2/Ts);else if(st.filter==='zoh')r+=(dt2>=0&&dt2<Ts)?sv:0;
        else{const f2=dt2/Ts;if(f2>=0&&f2<1)r+=sv*(1-f2);else if(f2>=-1&&f2<0)r+=sv*(1+f2);}}
      mse+=(msg(t)-r)*(msg(t)-r);}mse/=N;errEl.textContent=mse.toFixed(4);}
    updateChart();
    requestAnimationFrame(draw);}

  function initChart(){
    const el=document.getElementById('recon-spectrum-chart');if(!el)return;
    chart=new Chart(el,{type:'bar',data:{labels:[],datasets:[{label:'|M(f)| Sampled',data:[],backgroundColor:'rgba(56,189,248,0.6)',borderColor:'#38bdf8',borderWidth:1}]},
      options:{responsive:true,maintainAspectRatio:false,animation:false,scales:{x:{title:{display:true,text:'Frequency (Hz)',color:'#94a3b8'},ticks:{color:'#94a3b8'},grid:{color:'#1e2d4a'}},y:{title:{display:true,text:'Magnitude',color:'#94a3b8'},ticks:{color:'#94a3b8'},grid:{color:'#1e2d4a'}}},plugins:{legend:{labels:{color:'#e2e8f0'}}}}});
  }
  function updateChart(){
    if(!chart)return;
    const N=128;const fs2=st.fs;const dt=1/fs2;
    const re=new Float64Array(N),im=new Float64Array(N);
    for(let i=0;i<N;i++){re[i]=msg(i*dt);}
    const FR=fft(re,im);
    const labels=[];const data=[];
    for(let i=0;i<N/2;i++){const f=(i*fs2/N).toFixed(1);labels.push(f);
      data.push(Math.sqrt(FR.re[i]*FR.re[i]+FR.im[i]*FR.im[i])/N*2);}
    chart.data.labels=labels;chart.data.datasets[0].data=data;chart.update('none');
  }

  function bindControls(){
    const fsS=document.getElementById('recon-fs');if(fsS)fsS.addEventListener('input',debounce(function(){st.fs=parseFloat(fsS.value);document.getElementById('recon-fs-val').textContent=fsS.value;},16));
    document.querySelectorAll('input[name="recon-filter"]').forEach(function(r){r.addEventListener('change',function(){st.filter=r.value;});});
    const pb=document.getElementById('recon-play-btn');if(pb)pb.addEventListener('click',function(){st.playing=!st.playing;pb.textContent=st.playing?'⏸ Pause':'▶ Play';});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
