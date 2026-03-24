/* PPM Simulator — Chapter 5 Sim 3 */
(function(){
  const st={fs:12,fm:1,maxShift:0.4,playing:true,time:0,speed:1};
  let canvas,ctx,W,H,last=0;
  function init(){canvas=document.getElementById('ppm-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();requestAnimationFrame(draw);}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=300;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function msg(t){return Math.sin(2*Math.PI*st.fm*t)+0.3*Math.cos(2*Math.PI*1.8*st.fm*t);}
  function draw(ts){if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(st.playing)st.time+=dt*st.speed;
    ctx.clearRect(0,0,W,H);
    const mid=H/2,amp=H*0.35,dur=3/st.fm,Ts=1/st.fs;
    // Original dashed
    ctx.strokeStyle='rgba(56,189,248,0.3)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();
    for(let x=0;x<W;x++){const t=st.time+(x/W)*dur;const y=mid-amp*msg(t);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText('PPM Detailed — max shift = '+st.maxShift.toFixed(2)+' Ts',8,14);
    // PPM pulses with arrows
    for(let tn=Math.ceil(st.time*st.fs)/st.fs;tn<=st.time+dur;tn+=Ts){
      const v=msg(tn);const shift=v*st.maxShift*Ts;
      const xRef=((tn-st.time)/dur)*W;
      const xPPM=((tn+shift-st.time)/dur)*W;
      if(xPPM<0||xPPM>W)continue;
      // Reference line
      ctx.strokeStyle='rgba(100,116,139,0.25)';ctx.lineWidth=0.8;
      ctx.beginPath();ctx.moveTo(xRef,mid-amp*0.7);ctx.lineTo(xRef,mid+amp*0.7);ctx.stroke();
      // Shift arrow
      if(Math.abs(xPPM-xRef)>2){
        ctx.strokeStyle='#fb7185';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(xRef,mid+amp*0.5);ctx.lineTo(xPPM,mid+amp*0.5);ctx.stroke();
        const dir=xPPM>xRef?-1:1;
        ctx.beginPath();ctx.moveTo(xPPM,mid+amp*0.5);ctx.lineTo(xPPM+dir*5,mid+amp*0.5-4);ctx.lineTo(xPPM+dir*5,mid+amp*0.5+4);ctx.closePath();ctx.fillStyle='#fb7185';ctx.fill();
      }
      // PPM pulse
      ctx.strokeStyle='#2dd4bf';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xPPM,mid+amp*0.3);ctx.lineTo(xPPM,mid-amp*0.7);ctx.stroke();
      ctx.fillStyle='#2dd4bf';ctx.beginPath();ctx.arc(xPPM,mid-amp*0.7,3,0,2*Math.PI);ctx.fill();
    }
    requestAnimationFrame(draw);}
  function bindControls(){
    const ms=document.getElementById('ppm-maxshift');if(ms)ms.addEventListener('input',debounce(function(){st.maxShift=parseFloat(ms.value);document.getElementById('ppm-maxshift-val').textContent=ms.value;},16));
    const pb=document.getElementById('ppm-play-btn');if(pb)pb.addEventListener('click',function(){st.playing=!st.playing;pb.textContent=st.playing?'⏸ Pause':'▶ Play';});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
