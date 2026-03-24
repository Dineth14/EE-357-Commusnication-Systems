/* Line Codes Waveform — Chapter 7 Sim 1 */
(function(){
  const st={bits:'10110010',code:'nrz-l'};
  let canvas,ctx,W,H;
  function init(){canvas=document.getElementById('linecode-canvas');if(!canvas)return;ctx=canvas.getContext('2d');resize();window.addEventListener('resize',resize);bindControls();draw();}
  function resize(){const r=canvas.parentElement.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=300;canvas.width=W*d;canvas.height=H*d;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);}
  function encode(bits,code){
    const out=[];const N=bits.length;
    let lastLevel=1;// for differential
    for(let i=0;i<N;i++){const b=parseInt(bits[i]);
      switch(code){
        case 'nrz-l':out.push(b?1:-1);break;
        case 'nrz-i':if(b)lastLevel=-lastLevel;out.push(lastLevel);break;
        case 'rz':out.push(b?[1,0]:[-1,0]);break;
        case 'manchester':out.push(b?[1,-1]:[-1,1]);break;
        case 'diff-manchester':if(b)lastLevel=-lastLevel;out.push([lastLevel,-lastLevel]);lastLevel=-lastLevel;break;
        case 'ami':if(b){out.push(lastLevel);lastLevel=-lastLevel;}else out.push(0);break;
        default:out.push(b?1:-1);
      }}return out;}

  function draw(){
    ctx.clearRect(0,0,W,H);const bits=st.bits;const encoded=encode(bits,st.code);const N=bits.length;
    const bitW=W/N,mid=H*0.55,amp=H*0.3;
    // Grid and bit labels
    ctx.fillStyle='#64748b';ctx.font='12px JetBrains Mono';
    for(let i=0;i<N;i++){
      ctx.fillText(bits[i],i*bitW+bitW/2-4,20);
      ctx.strokeStyle='rgba(100,116,139,0.2)';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(i*bitW,30);ctx.lineTo(i*bitW,H-10);ctx.stroke();
    }
    // Reference lines
    ctx.strokeStyle='rgba(100,116,139,0.3)';ctx.lineWidth=0.5;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(0,mid);ctx.lineTo(W,mid);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,mid-amp);ctx.lineTo(W,mid-amp);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,mid+amp);ctx.lineTo(W,mid+amp);ctx.stroke();ctx.setLineDash([]);
    // Labels
    ctx.fillStyle='#94a3b8';ctx.font='10px Inter';ctx.fillText('+V',2,mid-amp-4);ctx.fillText('0',2,mid-4);ctx.fillText('-V',2,mid+amp-4);
    // Waveform
    ctx.strokeStyle='#38bdf8';ctx.lineWidth=2.5;ctx.beginPath();
    let lastY=mid;let started=false;
    for(let i=0;i<N;i++){const x=i*bitW;const val=encoded[i];
      if(Array.isArray(val)){
        const y1=mid-amp*val[0],y2=mid-amp*val[1];
        if(started){ctx.lineTo(x,y1);}else{ctx.moveTo(x,y1);started=true;}
        ctx.lineTo(x+bitW/2,y1);ctx.lineTo(x+bitW/2,y2);ctx.lineTo(x+bitW,y2);lastY=y2;
      } else {
        const y=mid-amp*val;
        if(started){if(Math.abs(y-lastY)>1)ctx.lineTo(x,y);}else{ctx.moveTo(x,y);started=true;}
        ctx.lineTo(x+bitW,y);lastY=y;
      }
    }ctx.stroke();
    // Code name
    ctx.fillStyle='#e2e8f0';ctx.font='bold 13px Inter';ctx.fillText(st.code.toUpperCase(),W-ctx.measureText(st.code.toUpperCase()).width-10,20);
  }

  function bindControls(){
    const input=document.getElementById('linecode-bits');if(input)input.addEventListener('input',function(){st.bits=input.value.replace(/[^01]/g,'').substring(0,16);input.value=st.bits;draw();});
    document.querySelectorAll('input[name="linecode-type"]').forEach(function(r){r.addEventListener('change',function(){st.code=r.value;draw();});});
  }
  document.addEventListener('DOMContentLoaded',init);
})();
