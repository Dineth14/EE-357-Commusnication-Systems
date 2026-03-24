/* Sampling Simulator — Chapter 4 Sim 1 */
(function(){
  const st={fs:8,fm:1,mode:'ideal',playing:true,time:0,speed:1,dutyCycle:0.3};
  let canvas,ctx,W,H,last=0;
  function init(){canvas=document.getElementById('sampling-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();requestAnimationFrame(draw);}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=440;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function msg(t){return Math.sin(2*Math.PI*st.fm*t)+0.3*Math.sin(2*Math.PI*2.2*st.fm*t);}
  function draw(ts){if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(st.playing)st.time+=dt*st.speed;
    ctx.clearRect(0,0,W,H);
    const pH=H/2, dur=3/st.fm;
    // Panel 1: original + sampled
    drawPanel(0,pH,'Original Signal m(t) + Samples',dur);
    // Panel 2: reconstructed
    drawPanel(pH,pH,'Reconstructed Signal',dur);
    // Update readouts
    const ratio=st.fs/st.fm;
    const nyq=document.getElementById('sampling-nyquist');
    if(nyq){nyq.textContent=ratio>=2?'✓ Satisfied (fs ≥ 2fm)':'✗ Aliasing! (fs < 2fm)';nyq.style.color=ratio>=2?'#2dd4bf':'#fb7185';}
    const ratioEl=document.getElementById('sampling-ratio');if(ratioEl)ratioEl.textContent=ratio.toFixed(1);
    requestAnimationFrame(draw);}

  function drawPanel(yO,pH,label,dur){
    const mid=yO+pH/2,amp=pH*0.35;
    ctx.strokeStyle='#1e2d4a';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(0,yO);ctx.lineTo(W,yO);ctx.stroke();
    ctx.strokeStyle='#334155';ctx.lineWidth=0.3;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText(label,8,yO+16);

    if(yO===0){
      // Original signal
      ctx.strokeStyle='#38bdf8';ctx.lineWidth=1.5;ctx.beginPath();
      for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const y=mid-amp*msg(t);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
      // Sample points
      const Ts=1/st.fs;
      const tStart=st.time;
      const tEnd=st.time+dur;
      for(let ts2=Math.ceil(tStart*st.fs)/st.fs;ts2<=tEnd;ts2+=Ts){
        const x=((ts2-tStart)/dur)*W;if(x<0||x>W)continue;const v=msg(ts2);const y=mid-amp*v;
        if(st.mode==='ideal'){
          ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(x,y,4,0,2*Math.PI);ctx.fill();
          ctx.strokeStyle='#fbbf24';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,mid);ctx.lineTo(x,y);ctx.stroke();
        } else if(st.mode==='natural'){
          const pw=(st.dutyCycle*Ts/dur)*W;
          ctx.fillStyle='rgba(251,191,36,0.25)';ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.2;ctx.beginPath();
          for(let px=0;px<=pw;px++){const tt=ts2+(px/W)*dur;const py=mid-amp*msg(tt);if(px===0)ctx.moveTo(x+px,py);else ctx.lineTo(x+px,py);}
          ctx.lineTo(x+pw,mid);ctx.lineTo(x,mid);ctx.closePath();ctx.fill();ctx.stroke();
        } else {
          const pw=(st.dutyCycle*Ts/dur)*W;
          ctx.fillStyle='rgba(251,191,36,0.25)';ctx.fillRect(x,Math.min(y,mid),pw,Math.abs(y-mid));
          ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.2;ctx.strokeRect(x,Math.min(y,mid),pw,Math.abs(y-mid));
        }
      }
    } else {
      // Reconstruction via sinc interpolation
      const tStart=st.time;const Ts=1/st.fs;
      ctx.strokeStyle='#2dd4bf';ctx.lineWidth=1.8;ctx.beginPath();
      for(let x=0;x<W;x++){const t=tStart+(x/W)*dur;let y=0;
        for(let k=-20;k<=20;k++){const ts2=Math.round(tStart*st.fs)/st.fs+k*Ts;y+=msg(ts2)*sinc((t-ts2)/Ts);}
        const py=mid-amp*y;if(x===0)ctx.moveTo(x,py);else ctx.lineTo(x,py);}ctx.stroke();
      // Original for comparison
      ctx.strokeStyle='rgba(56,189,248,0.3)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();
      for(let x=0;x<W;x++){const t=tStart+(x/W)*dur;const py=mid-amp*msg(t);if(x===0)ctx.moveTo(x,py);else ctx.lineTo(x,py);}ctx.stroke();ctx.setLineDash([]);
    }
  }

  function bindControls(){
    const fsS=document.getElementById('sampling-fs');if(fsS)fsS.addEventListener('input',debounce(function(){st.fs=parseFloat(fsS.value);document.getElementById('sampling-fs-val').textContent=fsS.value;},16));
    const fmS=document.getElementById('sampling-fm');if(fmS)fmS.addEventListener('input',debounce(function(){st.fm=parseFloat(fmS.value);document.getElementById('sampling-fm-val').textContent=fmS.value;},16));
    document.querySelectorAll('input[name="sampling-mode"]').forEach(function(r){r.addEventListener('change',function(){st.mode=r.value;});});
    const pb=document.getElementById('sampling-play-btn');if(pb)pb.addEventListener('click',function(){st.playing=!st.playing;pb.textContent=st.playing?'⏸ Pause':'▶ Play';});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
