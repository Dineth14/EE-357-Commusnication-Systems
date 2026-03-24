/* PDM / PWM Simulator — Chapter 5 Sim 2 */
(function(){
  const st={fs:15,fm:1,playing:true,time:0,speed:1};
  let canvas,ctx,W,H,last=0;
  function init(){canvas=document.getElementById('pdm-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();requestAnimationFrame(draw);}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=360;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function msg(t){return Math.sin(2*Math.PI*st.fm*t);}
  function draw(ts){if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(st.playing)st.time+=dt*st.speed;
    ctx.clearRect(0,0,W,H);
    const pH=H/2,dur=3/st.fm,Ts=1/st.fs;
    // Panel 1: PWM (Pulse-Width Modulation)
    const mid1=pH/2,amp1=pH*0.35;
    ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText('PWM (Pulse-Width Modulation)',8,14);
    // Reference signal dashed
    ctx.strokeStyle='rgba(56,189,248,0.3)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();
    for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const y=mid1-amp1*msg(t);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.setLineDash([]);
    // PWM pulses
    for(let tn=Math.ceil(st.time*st.fs)/st.fs;tn<=st.time+dur;tn+=Ts){
      const x0=((tn-st.time)/dur)*W;if(x0<0)continue;
      const v=(msg(tn)+1)/2;// normalize 0-1
      const pw=v*(Ts/dur)*W;
      ctx.fillStyle='rgba(251,191,36,0.3)';ctx.fillRect(x0,mid1-amp1,pw,2*amp1);
      ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.2;ctx.strokeRect(x0,mid1-amp1,pw,2*amp1);
    }
    ctx.strokeStyle='#1e2d4a';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(0,pH);ctx.lineTo(W,pH);ctx.stroke();

    // Panel 2: PPM (Pulse-Position Modulation)
    const mid2=pH+pH/2,amp2=pH*0.35;
    ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText('PPM (Pulse-Position Modulation)',8,pH+14);
    ctx.strokeStyle='rgba(56,189,248,0.3)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();
    for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const y=mid2-amp2*msg(t);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.setLineDash([]);
    // PPM pulses
    const pulseW=3;
    for(let tn=Math.ceil(st.time*st.fs)/st.fs;tn<=st.time+dur;tn+=Ts){
      const v=(msg(tn)+1)/2;
      const shift=v*Ts*0.5;
      const x0=((tn+shift-st.time)/dur)*W;if(x0<0||x0>W)continue;
      ctx.fillStyle='rgba(45,212,191,0.4)';ctx.fillRect(x0-pulseW/2,mid2-amp2,pulseW,2*amp2);
      ctx.strokeStyle='#2dd4bf';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(x0,mid2-amp2);ctx.lineTo(x0,mid2+amp2);ctx.stroke();
      // Reference position
      const xRef=((tn-st.time)/dur)*W;
      ctx.strokeStyle='rgba(100,116,139,0.3)';ctx.lineWidth=0.5;ctx.setLineDash([2,2]);
      ctx.beginPath();ctx.moveTo(xRef,mid2-amp2*0.3);ctx.lineTo(xRef,mid2+amp2*0.3);ctx.stroke();ctx.setLineDash([]);
    }
    requestAnimationFrame(draw);}
  function bindControls(){
    const fsS=document.getElementById('pdm-fs');if(fsS)fsS.addEventListener('input',debounce(function(){st.fs=parseFloat(fsS.value);document.getElementById('pdm-fs-val').textContent=fsS.value;},16));
    const pb=document.getElementById('pdm-play-btn');if(pb)pb.addEventListener('click',function(){st.playing=!st.playing;pb.textContent=st.playing?'⏸ Pause':'▶ Play';});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
