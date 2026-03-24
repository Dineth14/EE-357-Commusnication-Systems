/* Matched Filter Demo — Chapter 8 Sim 3 */
(function(){
  const st={snr:10,pulseType:'rect',playing:true,time:0};
  let canvas,ctx,W,H,last=0;
  function init(){canvas=document.getElementById('matched-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();requestAnimationFrame(draw);}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=420;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function pulse(t){
    if(st.pulseType==='rect')return(t>=0&&t<1)?1:0;
    if(st.pulseType==='sinc')return sinc(t-0.5)*((t>=-2&&t<=3)?1:0);
    if(st.pulseType==='rc')return(t>=0&&t<1)?Math.sin(Math.PI*t):0;
    return 0;
  }
  function draw(ts){if(!last)last=ts;const dt=(ts-last)/1000;last=ts;if(st.playing)st.time+=dt*0.5;
    ctx.clearRect(0,0,W,H);
    const pH=H/3,dur=6;
    const bits=[1,0,1,1,0,1,0,0];const sigma=Math.pow(10,-st.snr/20)*0.5;

    // Panel 1: Transmitted + noise
    drawLabel(0,'Received signal r(t) = s(t) + n(t)');
    const mid1=pH/2,amp1=pH*0.35;
    ctx.strokeStyle='#38bdf8';ctx.lineWidth=1.5;ctx.beginPath();
    for(let x=0;x<W;x++){const t=(x/W)*dur;const bitIdx=Math.floor(t);const bitFrac=t-bitIdx;
      const b=(bits[bitIdx%bits.length]||0);const s=b*pulse(bitFrac);
      const n=gaussianNoise(0,sigma);const y=mid1-amp1*(s+n);
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();

    // Panel 2: Matched filter impulse response
    drawLabel(pH,'Matched filter h(t) = s(T-t)');
    const mid2=pH+pH/2,amp2=pH*0.35;
    ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.beginPath();
    for(let x=0;x<W;x++){const t=(x/W)*2;// show 2 bit periods for the template
      const y=mid2-amp2*pulse(1-t);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();

    // Panel 3: Correlator output
    drawLabel(2*pH,'Correlator output — sample at t=kTb');
    const mid3=2*pH+pH/2,amp3=pH*0.3;
    ctx.strokeStyle='#2dd4bf';ctx.lineWidth=2;ctx.beginPath();
    const sampN=50;
    for(let x=0;x<W;x++){const t=(x/W)*dur;const bitIdx=Math.floor(t);const frac=t-bitIdx;
      const b=bits[bitIdx%bits.length]||0;
      // Simulate correlator ramp
      let corr=b*frac+gaussianNoise(0,sigma*0.3)*frac;
      const y=mid3-amp3*corr;
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
    // Decision points
    for(let k=0;k<8;k++){const xPos=((k+1)/dur)*W;
      ctx.strokeStyle='rgba(251,191,36,0.4)';ctx.lineWidth=0.5;ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(xPos,2*pH);ctx.lineTo(xPos,H);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=bits[k]?'#2dd4bf':'#fb7185';ctx.beginPath();ctx.arc(xPos,mid3-amp3*(bits[k]||0),4,0,2*Math.PI);ctx.fill();
    }
    // Readouts
    const pe=document.getElementById('matched-pe');if(pe){const snrLin=Math.pow(10,st.snr/10);const ber=0.5*Math.exp(-snrLin/2);pe.textContent=ber.toExponential(2);}
    requestAnimationFrame(draw);}

  function drawLabel(yO,text){ctx.strokeStyle='#1e2d4a';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(0,yO);ctx.lineTo(W,yO);ctx.stroke();ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText(text,8,yO+14);}

  function bindControls(){
    const ss=document.getElementById('matched-snr');if(ss)ss.addEventListener('input',debounce(function(){st.snr=parseFloat(ss.value);document.getElementById('matched-snr-val').textContent=ss.value;},16));
    document.querySelectorAll('input[name="matched-pulse"]').forEach(function(r){r.addEventListener('change',function(){st.pulseType=r.value;});});
    const pb=document.getElementById('matched-play-btn');if(pb)pb.addEventListener('click',function(){st.playing=!st.playing;pb.textContent=st.playing?'⏸ Pause':'▶ Play';});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
