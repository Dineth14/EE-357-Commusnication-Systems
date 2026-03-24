/* ASK / FSK / PSK Waveforms — Chapter 9 Sim 1 */
(function(){
  const st={bits:'10110010',scheme:'bpsk',fc:8,playing:true,time:0,speed:0.5};
  let canvas,ctx,W,H,last=0;
  function init(){canvas=document.getElementById('askfskpsk-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();requestAnimationFrame(draw);}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=360;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function draw(ts){if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(st.playing)st.time+=dt*st.speed;
    ctx.clearRect(0,0,W,H);
    const bits=st.bits;const N=bits.length;const pH=H/2;
    // Panel 1: Binary data
    const mid1=pH*0.3,amp1=pH*0.2;
    ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText('Binary Data',8,14);
    const bitW=W/N;
    for(let i=0;i<N;i++){const b=parseInt(bits[i]);
      ctx.fillStyle=b?'rgba(56,189,248,0.15)':'rgba(251,113,133,0.1)';ctx.fillRect(i*bitW,25,bitW,pH*0.35);
      ctx.fillStyle='#e2e8f0';ctx.font='bold 14px JetBrains Mono';ctx.fillText(bits[i],i*bitW+bitW/2-5,mid1+5);
      ctx.strokeStyle='rgba(100,116,139,0.2)';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(i*bitW,25);ctx.lineTo(i*bitW,H);ctx.stroke();
    }
    // Panel 2: Modulated signal
    const y2=pH*0.55;const mid2=(y2+H)/2,amp2=(H-y2)*0.35;
    ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText(st.scheme.toUpperCase()+' Modulated Signal',8,y2+12);
    ctx.strokeStyle='#334155';ctx.lineWidth=0.3;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,mid2);ctx.lineTo(W,mid2);ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle='#38bdf8';ctx.lineWidth=1.8;ctx.beginPath();
    const dur=N;// N bit periods
    for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const bitIdx=Math.floor(t)%N;const b=parseInt(bits[bitIdx<0?0:bitIdx]||'0');let y;
      switch(st.scheme){
        case 'ask':y=mid2-amp2*(b?1:0.1)*Math.sin(2*Math.PI*st.fc*t/N);break;
        case 'fsk':{const f=b?st.fc*1.5:st.fc*0.7;y=mid2-amp2*Math.sin(2*Math.PI*f*t/N);break;}
        case 'bpsk':y=mid2-amp2*Math.sin(2*Math.PI*st.fc*t/N+(b?0:Math.PI));break;
        case 'dpsk':{let phase=0;for(let k=0;k<=bitIdx;k++)if(parseInt(bits[k]))phase+=Math.PI;
          y=mid2-amp2*Math.sin(2*Math.PI*st.fc*t/N+phase);break;}
        default:y=mid2;}
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
    requestAnimationFrame(draw);}
  function bindControls(){
    document.querySelectorAll('input[name="mod-scheme"]').forEach(function(r){r.addEventListener('change',function(){st.scheme=r.value;});});
    const pb=document.getElementById('askfskpsk-play-btn');if(pb)pb.addEventListener('click',function(){st.playing=!st.playing;pb.textContent=st.playing?'⏸ Pause':'▶ Play';});
    const bi=document.getElementById('askfskpsk-bits');if(bi)bi.addEventListener('input',function(){st.bits=bi.value.replace(/[^01]/g,'').substring(0,16);bi.value=st.bits;});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
