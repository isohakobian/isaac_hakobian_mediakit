import Foundation
import AVFoundation

let root="scratch/promo-v2/"
let asset=AVURLAsset(url:URL(fileURLWithPath:root+"isaac-promo-v2-master.mp4"))
let sourceVideo=asset.tracks(withMediaType:.video).first!
let sourceAudio=asset.tracks(withMediaType:.audio).first!
let reader=try AVAssetReader(asset:asset)
let videoOut=AVAssetReaderVideoCompositionOutput(videoTracks:[sourceVideo],videoSettings:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_32BGRA])
let vc=AVMutableVideoComposition();vc.renderSize=CGSize(width:1280,height:720);vc.frameDuration=CMTime(value:1,timescale:30)
let instruction=AVMutableVideoCompositionInstruction();instruction.timeRange=CMTimeRange(start:.zero,duration:asset.duration)
let layer=AVMutableVideoCompositionLayerInstruction(assetTrack:sourceVideo);layer.setTransform(CGAffineTransform(scaleX:2.0/3.0,y:2.0/3.0),at:.zero)
instruction.layerInstructions=[layer];vc.instructions=[instruction];videoOut.videoComposition=vc
let audioOut=AVAssetReaderTrackOutput(track:sourceAudio,outputSettings:nil)
reader.add(videoOut);reader.add(audioOut)
let url=URL(fileURLWithPath:root+"isaac-promo-v2.mp4")
let writer=try AVAssetWriter(outputURL:url,fileType:.mp4);writer.shouldOptimizeForNetworkUse=true
let videoIn=AVAssetWriterInput(mediaType:.video,outputSettings:[AVVideoCodecKey:AVVideoCodecType.h264,AVVideoWidthKey:1280,AVVideoHeightKey:720,AVVideoCompressionPropertiesKey:[AVVideoAverageBitRateKey:2100000,AVVideoExpectedSourceFrameRateKey:30,AVVideoMaxKeyFrameIntervalKey:60,AVVideoProfileLevelKey:AVVideoProfileLevelH264HighAutoLevel]])
let audioIn=AVAssetWriterInput(mediaType:.audio,outputSettings:nil,sourceFormatHint:(sourceAudio.formatDescriptions.first as! CMFormatDescription))
writer.add(videoIn);writer.add(audioIn)
guard writer.startWriting(),reader.startReading() else {throw writer.error ?? reader.error!}
writer.startSession(atSourceTime:.zero)
let group=DispatchGroup()
func transfer(_ input:AVAssetWriterInput,_ output:AVAssetReaderOutput,_ name:String) {
  group.enter()
  input.requestMediaDataWhenReady(on:DispatchQueue(label:name)) {
    while input.isReadyForMoreMediaData {
      let result:Bool=autoreleasepool {
        guard let sample=output.copyNextSampleBuffer() else {return false}
        return input.append(sample)
      }
      if !result {input.markAsFinished();group.leave();return}
    }
  }
}
transfer(videoIn,videoOut,"promo-video");transfer(audioIn,audioOut,"promo-audio")
group.wait();let sem=DispatchSemaphore(value:0);writer.finishWriting{sem.signal()};sem.wait()
guard writer.status == .completed else {throw writer.error!}
print(url.path)
