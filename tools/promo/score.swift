import Foundation
import AVFoundation

// Original synthesized score and transitions: no samples or licensed music.
let sr=48000.0, total=36.0
let count=Int(sr*total)
var left=[Float](repeating:0,count:count),right=[Float](repeating:0,count:count)
let tau=Double.pi*2
var rng:UInt64=731924011
func noise()->Double {rng=rng&*6364136223846793005&+1;return Double((rng>>32)&0xffff)/32768-1}
func add(_ t:Double,_ length:Double,_ pan:Double=0,_ sound:(Double)->Double) {
  let first=Int(t*sr), n=Int(length*sr)
  for j in 0..<n where first+j>=0 && first+j<count {
    let v=sound(Double(j)/sr)
    left[first+j]+=Float(v*sqrt((1-pan)*0.5));right[first+j]+=Float(v*sqrt((1+pan)*0.5))
  }
}
func tone(_ t:Double,_ frequency:Double,_ length:Double,_ amp:Double,_ pan:Double) {
  add(t,length,pan) {x in
    let env=(1-exp(-x*180))*exp(-x*4.4)
    return amp*env*(sin(tau*frequency*x)+0.18*sin(tau*frequency*2*x)+0.07*sin(tau*frequency*3*x))
  }
}
let chords:[[Double]]=[[146.832,174.614,220,261.626],[116.541,146.832,174.614,220],[130.813,164.814,195.998,246.942],[130.813,174.614,220,261.626]]
for n in 0..<count {
  let t=Double(n)/sr
  let chord=chords[min(3,Int(t/8)%4)]
  let intro=min(1,t/2.4),outro=min(1,(36-t)/1.8)
  let breath=0.62+0.38*pow(sin(Double.pi*(t.truncatingRemainder(dividingBy:0.5))/0.5),2)
  let amp=0.022*intro*outro*breath
  for (k,f) in chord.enumerated() {
    left[n]+=Float(amp*sin(tau*f*t+Double(k)*0.3))
    right[n]+=Float(amp*sin(tau*(f+0.28)*t+Double(k)*0.3))
  }
}
// A restrained four-on-the-floor pulse and a dry, light percussive layer.
for beat in 0..<52 {
  let t=3+Double(beat)*0.5
  if t>=25 && t<29 {continue}
  add(t,0.28) {x in 0.3*exp(-x*18)*sin(tau*(43*x+2.6*(1-exp(-x*30))))}
  if beat%2==1 {
    add(t,0.15,0.08) {x in 0.10*noise()*exp(-x*37)*(1-exp(-x*900))}
  }
  add(t+0.25,0.055,-0.25) {x in 0.042*noise()*exp(-x*90)}
  if beat%2==0 {tone(t,beat<26 ? 73.416:65.406,0.42,0.12,-0.1)}
}
let notes=[293.665,440.0,523.251,349.228,293.665,523.251,440,659.255]
for i in 0..<112 {
  let t=3+Double(i)*0.25
  if t>=25 && t<29 {continue}
  let f=notes[i%8]
  let pan=sin(Double(i)*1.3)*0.55
  tone(t,f,0.9,i%4==0 ? 0.060:0.038,pan)
  tone(t+0.375,f,0.65,0.017,-pan)
}
// Short whooshes match the visual wipes, with no harsh transients.
for cut in [3.0,5,9,10,14,18,22,23,24,25,29,32] {
  add(cut-0.18,0.40) {x in
    let env=pow(max(0,sin(Double.pi*x/0.4)),3)
    return 0.065*env*(noise()*0.65+sin(tau*(240*x+950*x*x))*0.35)
  }
  tone(cut,cut==32 ? 587.33:880,0.6,0.045,0.3)
}
for (i,f) in [146.832,220.0,293.665,349.228,440.0,587.33].enumerated() {
  add(32,4,Double(i-3)/6) {x in 0.036*(1-exp(-x*40))*exp(-x*0.8)*sin(tau*f*x)}
}
var peak:Float=0
for n in 0..<count {peak=max(peak,abs(left[n]),abs(right[n]))}
let gain:Float=0.82/max(peak,0.01)
let format=AVAudioFormat(standardFormatWithSampleRate:sr,channels:2)!
let buffer=AVAudioPCMBuffer(pcmFormat:format,frameCapacity:AVAudioFrameCount(count))!
buffer.frameLength=AVAudioFrameCount(count)
for n in 0..<count {
  let t=Double(n)/sr
  let fade=Float(min(1,t/0.04)*min(1,(total-t)/1.6))
  buffer.floatChannelData![0][n]=left[n]*gain*fade
  buffer.floatChannelData![1][n]=right[n]*gain*fade
}
let path="scratch/promo-v2/original-score.wav"
let settings:[String:Any]=[AVFormatIDKey:kAudioFormatLinearPCM,AVSampleRateKey:sr,AVNumberOfChannelsKey:2,AVLinearPCMBitDepthKey:16,AVLinearPCMIsFloatKey:false,AVLinearPCMIsBigEndianKey:false]
var file: AVAudioFile?=try AVAudioFile(forWriting:URL(fileURLWithPath:path),settings:settings,commonFormat:.pcmFormatFloat32,interleaved:false)
try file!.write(from:buffer)
file=nil // Finalize the WAVE header before the process exits.
print("Original score: 36s / 48kHz stereo / peak <= 0.82")
