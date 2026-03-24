/* ISI Demo — Chapter 8 Sim 1 */
(function(){
  const st={numPulses:5,overlap:true,pulseType:'sinc',alpha:0};
  let canvas,ctx,W,H;
  function init(){canvas=document.getElementById('isi-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();draw();}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=360;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function pulseFn(t,alpha){
    if(st.pulseType==='sinc')return sinc(t);
    if(st.pulseType==='rc'){// Raised cosine
      if(alpha===0)return sinc(t);
      if(Math.abs(Math.abs(2*alpha*t)-1)<1e-10)return(Math.PI/4)*sinc(1/(2*alpha));
      return sinc(t)*Math.cos(Math.PI*alpha*t)/(1-Math.pow(2*alpha*t,2));
    }
    return sinc(t);// fallback
  }
  function draw(){
    ctx.clearRect(0,0,W,H);const mid=H*0.55,amp=H*0.3;
    const bits=[1,0,1,1,0,1,-1,0,1].slice(0,st.numPulses);// bipolar
    const alpha=st.alpha;
    // Draw individual pulses
    const colors=['#38bdf8','#2dd4bf','#fbbf24','#fb7185','#a78bfa','#34d399','#f472b6','#60a5fa','#facc15'];
    const Tb=1;const xScale=W/(st.numPulses+2);
    for(let k=0;k<bits.length;k++){
      const b=bits[k]?1:-1;const center=(k+1)*xScale;
      ctx.strokeStyle=colors[k%colors.length];ctx.lineWidth=1;ctx.globalAlpha=0.5;ctx.beginPath();
      for(let x=0;x<W;x++){const t=(x-center)/(xScale*0.8);const y=mid-amp*b*pulseFn(t,alpha);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
    }
    ctx.globalAlpha=1;
    // Sum signal
    ctx.strokeStyle='#e2e8f0';ctx.lineWidth=2.5;ctx.beginPath();
    for(let x=0;x<W;x++){let sum=0;
      for(let k=0;k<bits.length;k++){const b=bits[k]?1:-1;const center=(k+1)*xScale;const t=(x-center)/(xScale*0.8);sum+=b*pulseFn(t,alpha);}
      const y=mid-amp*sum;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
    // Sample points
    for(let k=0;k<bits.length;k++){const center=(k+1)*xScale;let sum=0;
      for(let j=0;j<bits.length;j++){const b=bits[j]?1:-1;const t=(center-(j+1)*xScale)/(xScale*0.8);sum+=b*pulseFn(t,alpha);}
      const y=mid-amp*sum;const expected=bits[k]?1:-1;const isCorrect=Math.abs(sum-expected)<0.3;
      ctx.fillStyle=isCorrect?'#2dd4bf':'#fb7185';ctx.beginPath();ctx.arc(center,y,5,0,2*Math.PI);ctx.fill();
      ctx.strokeStyle='rgba(100,116,139,0.3)';ctx.lineWidth=0.5;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(center,0);ctx.lineTo(center,H);ctx.stroke();ctx.setLineDash([]);
    }
    ctx.fillStyle='#64748b';ctx.font='11px Inter';ctx.fillText('ISI Demo — White: sum, Colored: individual pulses, Dots: sample points',8,14);
    const isiEl=document.getElementById('isi-status');
    if(isiEl){if(alpha>0.1)isiEl.textContent='α='+alpha.toFixed(2)+' — Reduced ISI (raised cosine rolloff)';
      else if(st.pulseType==='sinc')isiEl.textContent='Pure sinc — zero ISI at sample points (Nyquist criterion)';
      else isiEl.textContent='ISI present';}
  }
  function bindControls(){
    const as=document.getElementById('isi-alpha');if(as)as.addEventListener('input',debounce(function(){st.alpha=parseFloat(as.value);document.getElementById('isi-alpha-val').textContent=as.value;draw();},16));
    document.querySelectorAll('input[name="isi-pulse"]').forEach(function(r){r.addEventListener('change',function(){st.pulseType=r.value;draw();});});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
