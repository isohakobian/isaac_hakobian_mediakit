import AppKit
import AVFoundation
import CoreImage
import CoreText
import ImageIO
import UniformTypeIdentifiers

// Deterministic motion design. Source footage is never generated or replaced.
let W: CGFloat = 1920, H: CGFloat = 1080
let fps: Int32 = 30
let duration = 36.0
let mode = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "stills"
let language = CommandLine.arguments.count > 2 ? CommandLine.arguments[2] : "ru"
guard ["ru","en","hy"].contains(language) else {fatalError("Unsupported promo language")}
let outputDir = CommandLine.arguments.count > 3 ? CommandLine.arguments[3] : "scratch/promo-v3/"+language
let localePath = CommandLine.arguments.count > 4 ? CommandLine.arguments[4] : (FileManager.default.fileExists(atPath:"tools/promo/locales.json") ? "tools/promo/locales.json" : "scratch/promo-locales.json")
let dictionaries = try JSONDecoder().decode([String:[String:String]].self,from:Data(contentsOf:URL(fileURLWithPath:localePath)))
let localized = dictionaries[language] ?? [:]
var measuredWidths:[String:CGFloat]=[:]
try FileManager.default.createDirectory(atPath:outputDir,withIntermediateDirectories:true)
let colorSpace = CGColorSpaceCreateDeviceRGB()
let ciContext = CIContext(options:[.useSoftwareRenderer:false])

func rgb(_ hex: Int, _ alpha: CGFloat = 1) -> CGColor {
  CGColor(red:CGFloat((hex>>16)&255)/255,green:CGFloat((hex>>8)&255)/255,blue:CGFloat(hex&255)/255,alpha:alpha)
}
let ink = rgb(0x101011), paper = rgb(0xf6f4f0), copper = rgb(0xc99c78)
func clamp(_ x: Double) -> Double { max(0,min(1,x)) }
func ease(_ x: Double) -> Double { let a=clamp(x); return 1-pow(1-a,4) }
func smooth(_ x: Double) -> Double { let a=clamp(x); return a*a*(3-2*a) }
func lerp(_ a: CGFloat, _ b: CGFloat, _ t: Double) -> CGFloat { a+(b-a)*CGFloat(t) }

struct Shot {
  let file: String
  let start: Double
  let length: Double
}
let shots: [String:Shot] = [
  "hero":Shot(file:"swdr_1a75350f.mp4",start:25.2,length:3.2),
  "style1":Shot(file:"swdr_1a75350f.mp4",start:6.3,length:4.2),
  "style2":Shot(file:"swdr_1a75350f.mp4",start:12.2,length:4.2),
  "style3":Shot(file:"swdr_1a75350f.mp4",start:25.0,length:4.2),
  "detail":Shot(file:"maqoor_ec053bc5.mp4",start:27.5,length:2.0),
  "fitness1":Shot(file:"limber_4e9d4cd4.mp4",start:15.5,length:4.5),
  "fitness2":Shot(file:"limber_4e9d4cd4.mp4",start:35.0,length:4.5),
  "groom1":Shot(file:"abib_45613a61.mp4",start:38.4,length:4.2),
  "groom2":Shot(file:"abib_45613a61.mp4",start:21.4,length:4.2),
  "travel1":Shot(file:"yakapitan_73790604.mp4",start:6.4,length:4.3),
  "travel2":Shot(file:"yakapitan_73790604.mp4",start:10.7,length:4.3),
  "travel3":Shot(file:"dream_a6816766.mp4",start:19.5,length:4.3),
  "burst1":Shot(file:"abib_45613a61.mp4",start:54.0,length:1.0),
  "burst2":Shot(file:"dream_a6816766.mp4",start:27.0,length:1.0),
  "burst3":Shot(file:"swdr_1a75350f.mp4",start:16.5,length:1.0),
  "end":Shot(file:"swdr_1a75350f.mp4",start:26.5,length:4.0)
]

final class FrameReader {
  let asset: AVURLAsset
  let reader: AVAssetReader
  let output: AVAssetReaderTrackOutput
  let transform: CGAffineTransform
  let start: Double
  var pending: CMSampleBuffer?
  var latest: CMSampleBuffer?
  var image: CGImage?
  var lastPTS = -1.0
  init(_ shot: Shot) throws {
    asset=AVURLAsset(url:URL(fileURLWithPath:"scratch/"+shot.file))
    let track=asset.tracks(withMediaType:.video).first!
    transform=track.preferredTransform
    start=shot.start
    reader=try AVAssetReader(asset:asset)
    output=AVAssetReaderTrackOutput(track:track,outputSettings:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_32BGRA])
    output.alwaysCopiesSampleData=false
    reader.add(output)
    reader.timeRange=CMTimeRange(start:CMTime(seconds:shot.start,preferredTimescale:600),duration:CMTime(seconds:shot.length+0.1,preferredTimescale:600))
    guard reader.startReading() else {throw reader.error!}
  }
  func frame(_ offset:Double)->CGImage? {
    let requested=start+max(0,offset)
    while true {
      let sample=pending ?? output.copyNextSampleBuffer()
      guard let sample else {break}
      let pts=CMSampleBufferGetPresentationTimeStamp(sample).seconds
      if pts>requested+0.018, latest != nil {pending=sample;break}
      pending=nil;latest=sample
    }
    guard let latest, let buffer=CMSampleBufferGetImageBuffer(latest) else {return image}
    let pts=CMSampleBufferGetPresentationTimeStamp(latest).seconds
    if pts != lastPTS {
      let ci=CIImage(cvPixelBuffer:buffer).transformed(by:transform)
      image=ciContext.createCGImage(ci,from:ci.extent)
      lastPTS=pts
    }
    return image
  }
}
var readers:[String:FrameReader]=[:]
func source(_ id:String,_ t:Double)->CGImage? {
  if readers[id]==nil {readers[id]=try? FrameReader(shots[id]!)}
  return readers[id]?.frame(min(max(0,t),shots[id]!.length-0.06))
}

var typeCache:[String:CTLine]=[:]
func text(_ ctx:CGContext,_ value:String,_ x:CGFloat,_ y:CGFloat,_ size:CGFloat,_ color:CGColor,_ weight:String="Bold",_ tracking:CGFloat = -2,_ alpha:CGFloat=1) {
  let translated = localized[value] ?? value
  if language != "ru", value.range(of:"[А-Яа-яЁё]",options:.regularExpression) != nil, localized[value] == nil {fatalError("Missing translation: "+value)}
  let isArmenian = translated.range(of:"[Ա-Ֆա-ֆ]",options:.regularExpression) != nil
  let fontName = isArmenian ? "NotoSansArmenian" : "HelveticaNeue-"+weight
  func font(_ s:CGFloat)->CTFont {
    let base=CTFontCreateWithName(fontName as CFString,s,nil)
    return isArmenian && weight == "Bold" ? (CTFontCreateCopyWithSymbolicTraits(base,s,nil,.traitBold,.traitBold) ?? base) : base
  }
  let kern:CGFloat = isArmenian ? max(-0.6,tracking*0.25):tracking
  func makeLine(_ s:CGFloat)->CTLine {
    let attr=NSAttributedString(string:translated,attributes:[NSAttributedString.Key(kCTFontAttributeName as String):font(s),NSAttributedString.Key(kCTForegroundColorAttributeName as String):color,NSAttributedString.Key(kCTKernAttributeName as String):kern])
    return CTLineCreateWithAttributedString(attr)
  }
  var maxWidth=W-x-80
  if size>=90 {
    if x>=1100 {maxWidth=700}
    else if ["Реальные","истории."].contains(value) {maxWidth=970}
    else if ["Энергия,","которую","видно."].contains(value) {maxWidth=815}
    else if ["Всё","в деталях.","Исаак","Акобян."].contains(value) {maxWidth=1050}
    else if ["Создадим","вместе."].contains(value) {maxWidth=1120}
    else if ["Жить.","Создавать."].contains(value) {maxWidth=1050}
  }
  let initial=makeLine(size)
  let width=CGFloat(CTLineGetTypographicBounds(initial,nil,nil,nil))
  let fitSize=width>maxWidth ? floor(size*maxWidth/width):size
  measuredWidths[value]=min(width,maxWidth)
  let key=translated+"|\(fitSize)|\(weight)|\(kern)|\(color.components ?? [])"
  let line:CTLine
  if let cached=typeCache[key] {line=cached} else {
    line=makeLine(fitSize);typeCache[key]=line
  }
  let ascent=CTFontGetAscent(font(fitSize))
  ctx.saveGState();ctx.setAlpha(alpha);ctx.translateBy(x:x,y:y+(size-fitSize)*0.35+ascent);ctx.scaleBy(x:1,y:-1);ctx.textPosition = .zero;CTLineDraw(line,ctx);ctx.restoreGState()
}
func reveal(_ ctx:CGContext,_ value:String,_ x:CGFloat,_ y:CGFloat,_ size:CGFloat,_ color:CGColor,_ p:Double,_ weight:String="Bold",_ tracking:CGFloat = -3) {
  let e=ease(p)
  ctx.saveGState();ctx.clip(to:CGRect(x:x-15,y:y-4,width:W,height:size*1.25))
  text(ctx,value,x,y+CGFloat(1-e)*size*1.15,size,color,weight,tracking,CGFloat(e));ctx.restoreGState()
}
func fill(_ ctx:CGContext,_ color:CGColor) {ctx.setFillColor(color);ctx.fill(CGRect(x:0,y:0,width:W,height:H))}
func rounded(_ ctx:CGContext,_ r:CGRect,_ color:CGColor,_ radius:CGFloat) {ctx.setFillColor(color);ctx.addPath(CGPath(roundedRect:r,cornerWidth:radius,cornerHeight:radius,transform:nil));ctx.fillPath()}
func line(_ ctx:CGContext,_ x:CGFloat,_ y:CGFloat,_ w:CGFloat,_ color:CGColor) {ctx.setFillColor(color);ctx.fill(CGRect(x:x,y:y,width:w,height:1))}
func footage(_ ctx:CGContext,_ id:String,_ t:Double,_ rect:CGRect,_ radius:CGFloat=22,_ zoom:CGFloat=1,_ opacity:CGFloat=1,_ cropX:CGFloat=0.5,_ cropY:CGFloat=0.5) {
  guard let img=source(id,t) else {return}
  ctx.saveGState();ctx.setAlpha(opacity)
  ctx.addPath(CGPath(roundedRect:rect,cornerWidth:radius,cornerHeight:radius,transform:nil));ctx.clip()
  let scale=max(rect.width/CGFloat(img.width),rect.height/CGFloat(img.height))*zoom
  let iw=CGFloat(img.width)*scale, ih=CGFloat(img.height)*scale
  let x=rect.minX-(iw-rect.width)*cropX, y=rect.minY-(ih-rect.height)*cropY
  ctx.translateBy(x:x,y:y+ih);ctx.scaleBy(x:1,y:-1)
  ctx.draw(img,in:CGRect(x:0,y:0,width:iw,height:ih));ctx.restoreGState()
}
func label(_ ctx:CGContext,_ value:String,_ x:CGFloat,_ y:CGFloat,_ light:Bool) {text(ctx,value,x,y,20,light ? rgb(0xaaa9a7):rgb(0x777572),"Medium",2)}
func footer(_ ctx:CGContext,_ name:String,_ light:Bool,_ index:String) {
  label(ctx,"ISAAC HAKOBIAN",80,1004,light)
  label(ctx,name,650,1004,light)
}
func glow(_ ctx:CGContext,_ x:CGFloat,_ y:CGFloat,_ radius:CGFloat,_ alpha:CGFloat) {
  let colors=[rgb(0x9a5844,alpha),rgb(0x211515,0)] as CFArray
  let gradient=CGGradient(colorsSpace:colorSpace,colors:colors,locations:[0,1])!
  ctx.drawRadialGradient(gradient,startCenter:CGPoint(x:x,y:y),startRadius:0,endCenter:CGPoint(x:x,y:y),endRadius:radius,options:[])
}
func arrow(_ ctx:CGContext,_ x:CGFloat,_ y:CGFloat,_ color:CGColor) {
  ctx.setStrokeColor(color);ctx.setLineWidth(4);ctx.setLineCap(.round)
  ctx.move(to:CGPoint(x:x,y:y+18));ctx.addLine(to:CGPoint(x:x+35,y:y-17));ctx.addLine(to:CGPoint(x:x+7,y:y-17));ctx.move(to:CGPoint(x:x+35,y:y-17));ctx.addLine(to:CGPoint(x:x+35,y:y+11));ctx.strokePath()
}

func draw(_ ctx:CGContext,_ t:Double) {
  ctx.saveGState();ctx.translateBy(x:0,y:H);ctx.scaleBy(x:1,y:-1)
  ctx.setAllowsAntialiasing(true);ctx.interpolationQuality = .high
  if t<3 {
    fill(ctx,ink);glow(ctx,1400,620,800,0.55)
    let p=ease(t/0.85)
    footage(ctx,"hero",t,CGRect(x:lerp(1420,1190,p),y:84,width:560,height:880),30,1.06-CGFloat(t)*0.008)
    label(ctx,"ЛИЧНЫЙ ВЗГЛЯД / ИСТОРИИ БРЕНДОВ",80,86,true)
    reveal(ctx,"Исаак",80,250,174,paper,t/0.65)
    reveal(ctx,"Акобян.",80,420,174,paper,(t-0.18)/0.7)
    reveal(ctx,"Свой взгляд.",88,680,60,copper,(t-0.5)/0.7,"Medium",-1)
    line(ctx,88,790,CGFloat(ease((t-0.7)/0.8))*710,rgb(0x55504a))
    label(ctx,"В КАЖДОМ КАДРЕ.",88,824,true)
    footer(ctx,"КОНТЕНТ С ХАРАКТЕРОМ",true,"01 / 08")
  } else if t<5 {
    let u=t-3
    fill(ctx,paper)
    label(ctx,"СТИЛЬ — ЭТО ТОЧНОСТЬ",80,86,false)
    let e=ease(u/0.65)
    footage(ctx,"detail",u,CGRect(x:1290,y:lerp(470,200,e),width:450,height:690),26,1.04)
    reveal(ctx,"Всё",80,280,200,ink,u/0.55)
    reveal(ctx,"в деталях.",80,475,200,ink,(u-0.12)/0.6)
    footer(ctx,"МОДА / ОБРАЗ / НАСТРОЕНИЕ",false,"02 / 08")
  } else if t<9 {
    let u=t-5
    fill(ctx,paper)
    reveal(ctx,"Стиль. Без лишнего.",80,80,100,ink,u/0.55)
    let xs:[CGFloat]=[280,780,1280]
    for i in 0..<3 {
      let enter=ease((u-Double(i)*0.13)/0.75)
      footage(ctx,"style\(i+1)",u,CGRect(x:xs[i],y:lerp(490,250,enter),width:400,height:650),26,1.07-CGFloat(u)*0.01,CGFloat(enter))
    }
    footer(ctx,"SWDR.BY",false,"02 / 08")
  } else if t<10 {
    let u=t-9
    fill(ctx,ink);glow(ctx,1000,530,700,0.42)
    let sc=lerp(1.18,1,ease(u/0.6))
    ctx.translateBy(x:W/2,y:H/2);ctx.scaleBy(x:sc,y:sc);ctx.translateBy(x:-W/2,y:-H/2)
    reveal(ctx,"Движение.",220,398,228,paper,u/0.3)
  } else if t<14 {
    let u=t-10
    fill(ctx,ink)
    label(ctx,"ФИТНЕС / ПЕРВЫЙ ОПЫТ",80,86,true)
    reveal(ctx,"Энергия,",80,274,125,paper,u/0.6)
    reveal(ctx,"которую",80,405,125,paper,(u-0.1)/0.6)
    reveal(ctx,"видно.",80,536,125,copper,(u-0.25)/0.6)
    footage(ctx,"fitness1",u,CGRect(x:lerp(1300,960,ease(u/0.8)),y:180,width:370,height:720),24,1.02)
    footage(ctx,"fitness2",u,CGRect(x:lerp(1850,1350,ease((u-0.15)/0.8)),y:110,width:490,height:790),28,1.04)
    footer(ctx,"LIMBER LIFE ARMENIA × PRAVILO",true,"03 / 08")
  } else if t<18 {
    let u=t-14
    fill(ctx,paper)
    let e=ease(u/0.7)
    footage(ctx,"groom1",u,CGRect(x:80,y:lerp(400,100,e),width:540,height:840),30,1.02)
    footage(ctx,"groom2",u,CGRect(x:650,y:lerp(560,480,e),width:420,height:460),24,1.0)
    label(ctx,"УХОД / ЛИЧНЫЙ РИТУАЛ",1140,120,false)
    reveal(ctx,"Внимание",1140,300,106,ink,(u-0.1)/0.6)
    reveal(ctx,"к себе.",1140,419,135,ink,(u-0.25)/0.6)
    line(ctx,1140,625,CGFloat(ease((u-0.4)/0.7))*590,rgb(0xc9c5bd))
    text(ctx,"Каждый день.",1140,670,46,rgb(0x7b7166),"Medium",-1)
    footer(ctx,"ABIB",false,"04 / 08")
  } else if t<22 {
    let u=t-18
    fill(ctx,ink);glow(ctx,1600,200,900,0.22)
    reveal(ctx,"Менять горизонт.",80,70,126,paper,u/0.65)
    let ids=["travel1","travel3","travel2"]
    for i in 0..<3 {
      let e=ease((u-Double(i)*0.12)/0.8)
      footage(ctx,ids[i],u,CGRect(x:80+CGFloat(i)*596,y:lerp(420,270,e),width:568,height:650),24,1.06-CGFloat(u)*0.009,CGFloat(e),0.5,0.4)
    }
    footer(ctx,"YA KAPITAN · DREAM BEACH CLUB",true,"05 / 08")
  } else if t<25 {
    let u=t-22, n=min(2,Int(u)), v=u-Double(n)
    fill(ctx,n==1 ? paper:ink)
    let names=["Жить.","Чувствовать.","Создавать."]
    let ids=["burst1","burst2","burst3"]
    let x:CGFloat = n==1 ? 80:1220
    footage(ctx,ids[n],v,CGRect(x:x,y:40,width:620,height:1000),25,1.1-CGFloat(v)*0.06)
    reveal(ctx,names[n],n==1 ? 780:80,420,n==1 ? 140:165,n==1 ? ink:paper,v/0.28)
    label(ctx,"ОДИН ВЗГЛЯД. РАЗНЫЕ ИСТОРИИ.",n==1 ? 790:90,654,n != 1)
  } else if t<29 {
    let u=t-25
    fill(ctx,paper)
    label(ctx,"ОПЫТ, КОТОРЫЙ УЖЕ ЕСТЬ",80,86,false)
    reveal(ctx,"Реальные",80,250,172,ink,u/0.65)
    reveal(ctx,"истории.",80,422,172,ink,(u-0.15)/0.65)
    let brands=["SWDR.BY","Abib","Limber Life Armenia × Pravilo","Dream Beach Club","Ya Kapitan · Maqoor"]
    for (i,brand) in brands.enumerated() {
      let a=ease((u-0.35-Double(i)*0.12)/0.65)
      text(ctx,brand,lerp(1235,1130,a),265+CGFloat(i)*104,i==2 ? 30:42,rgb(0x353230),"Medium",-0.5,CGFloat(a))
      line(ctx,1130,340+CGFloat(i)*104,610,rgb(0xd7d2ca,CGFloat(a)))
    }
    footer(ctx,"БРЕНДЫ ИЗ МОЕГО ПОРТФОЛИО",false,"06 / 08")
  } else if t<32 {
    let u=t-29
    fill(ctx,ink);glow(ctx,1350,780,900,0.48)
    label(ctx,"НОВАЯ ИСТОРИЯ НАЧИНАЕТСЯ С ИДЕИ",80,86,true)
    reveal(ctx,"Ваш бренд.",80,290,190,paper,u/0.7)
    reveal(ctx,"Мой взгляд.",80,505,190,copper,(u-0.35)/0.7)
    footer(ctx,"ISAAC HAKOBIAN",true,"07 / 08")
  } else {
    let u=t-32
    fill(ctx,paper)
    let e=ease(u/0.85)
    footage(ctx,"end",u,CGRect(x:lerp(1560,1310,e),y:100,width:510,height:820),30,1.03)
    label(ctx,"ДЛЯ БРЕНДОВ С ХАРАКТЕРОМ",80,100,false)
    reveal(ctx,"Создадим",80,280,166,ink,u/0.7)
    reveal(ctx,"вместе.",80,450,166,ink,(u-0.2)/0.7)
    rounded(ctx,CGRect(x:88,y:706,width:76,height:76),ink,38);arrow(ctx,108,743,paper)
    text(ctx,"isohakobian@gmail.com",190,718,42,ink,"Medium",-0.7)
    text(ctx,"@isaac_hakobian",190,798,32,rgb(0x77716b),"Medium",0)
    footer(ctx,"ВАША СЛЕДУЮЩАЯ КОЛЛАБОРАЦИЯ",false,"08 / 08")
  }
  // A short, directional wipe joins chapters; no flash/flicker effect.
  let cuts:[Double]=[3,5,9,10,14,18,22,25,29,32]
  if let cut=cuts.first(where:{t >= $0 && t < $0+0.24}) {
    let p=smooth((t-cut)/0.24)
    ctx.setFillColor(rgb(0xe7ddd0));ctx.fill(CGRect(x:CGFloat(p)*W,y:0,width:W,height:H))
  }
  ctx.restoreGState()
}

func saveJPEG(_ image:CGImage,_ path:String) {
  let dest=CGImageDestinationCreateWithURL(URL(fileURLWithPath:path) as CFURL,UTType.jpeg.identifier as CFString,1,nil)!
  CGImageDestinationAddImage(dest,image,[kCGImageDestinationLossyCompressionQuality:0.9] as CFDictionary);CGImageDestinationFinalize(dest)
}
func still(_ t:Double,_ path:String) {
  readers=[:]
  let ctx=CGContext(data:nil,width:Int(W),height:Int(H),bitsPerComponent:8,bytesPerRow:Int(W)*4,space:colorSpace,bitmapInfo:CGImageAlphaInfo.premultipliedFirst.rawValue)!
  draw(ctx,t);saveJPEG(ctx.makeImage()!,path)
}

if mode == "stills" {
  for t in [1.5,4.2,7.0,11.6,16.0,20.0,23.4,27.0,30.5,34.2] {
    still(t,outputDir+"/frame-\(Int(t*10)).jpg")
  }
  print("stills ready")
} else {
  let out=URL(fileURLWithPath:outputDir+"/isaac-promo-v2-silent.mp4")
  if FileManager.default.fileExists(atPath:out.path) {throw NSError(domain:"Promo",code:1,userInfo:[NSLocalizedDescriptionKey:"Output already exists"])}
  let writer=try AVAssetWriter(outputURL:out,fileType:.mp4)
  let settings:[String:Any]=[AVVideoCodecKey:AVVideoCodecType.h264,AVVideoWidthKey:Int(W),AVVideoHeightKey:Int(H),AVVideoCompressionPropertiesKey:[AVVideoAverageBitRateKey:6500000,AVVideoExpectedSourceFrameRateKey:30,AVVideoMaxKeyFrameIntervalKey:60,AVVideoProfileLevelKey:AVVideoProfileLevelH264HighAutoLevel]]
  let input=AVAssetWriterInput(mediaType:.video,outputSettings:settings);input.expectsMediaDataInRealTime=false
  let adaptor=AVAssetWriterInputPixelBufferAdaptor(assetWriterInput:input,sourcePixelBufferAttributes:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_32ARGB,kCVPixelBufferWidthKey as String:Int(W),kCVPixelBufferHeightKey as String:Int(H),kCVPixelBufferCGImageCompatibilityKey as String:true,kCVPixelBufferCGBitmapContextCompatibilityKey as String:true])
  writer.add(input);writer.shouldOptimizeForNetworkUse=true
  guard writer.startWriting() else {throw writer.error!};writer.startSession(atSourceTime:.zero)
  for n in 0..<Int(duration*Double(fps)) {
    while !input.isReadyForMoreMediaData {Thread.sleep(forTimeInterval:0.005)}
    try autoreleasepool {
      var buffer:CVPixelBuffer?;CVPixelBufferPoolCreatePixelBuffer(nil,adaptor.pixelBufferPool!,&buffer)
      let b=buffer!;CVPixelBufferLockBaseAddress(b,[])
      let ctx=CGContext(data:CVPixelBufferGetBaseAddress(b),width:Int(W),height:Int(H),bitsPerComponent:8,bytesPerRow:CVPixelBufferGetBytesPerRow(b),space:colorSpace,bitmapInfo:CGImageAlphaInfo.noneSkipFirst.rawValue)!
      draw(ctx,Double(n)/Double(fps));CVPixelBufferUnlockBaseAddress(b,[])
      guard adaptor.append(b,withPresentationTime:CMTime(value:Int64(n),timescale:fps)) else {throw writer.error!}
    }
    if n%90==0 {print("render \(n)/1080");fflush(stdout)}
  }
  input.markAsFinished();let sem=DispatchSemaphore(value:0);writer.finishWriting {sem.signal()};sem.wait()
  guard writer.status == .completed else {throw writer.error!}
  print(out.path)
}
