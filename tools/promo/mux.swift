import Foundation
import AVFoundation

let root=(CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "scratch/promo-v2").trimmingCharacters(in:CharacterSet(charactersIn:"/"))+"/"
let video=AVURLAsset(url:URL(fileURLWithPath:root+"isaac-promo-v2-silent.mp4"))
let audio=AVURLAsset(url:URL(fileURLWithPath:"scratch/promo-v2/score-final.m4a"))
let mix=AVMutableComposition()
let range=CMTimeRange(start:.zero,duration:CMTime(seconds:36,preferredTimescale:600))
try mix.addMutableTrack(withMediaType:.video,preferredTrackID:kCMPersistentTrackID_Invalid)!.insertTimeRange(range,of:video.tracks(withMediaType:.video).first!,at:.zero)
try mix.addMutableTrack(withMediaType:.audio,preferredTrackID:kCMPersistentTrackID_Invalid)!.insertTimeRange(range,of:audio.tracks(withMediaType:.audio).first!,at:.zero)
func export(_ asset:AVAsset,_ preset:String,_ name:String) throws {
  let out=URL(fileURLWithPath:root+name)
  guard !FileManager.default.fileExists(atPath:out.path) else {throw NSError(domain:"Promo",code:1,userInfo:[NSLocalizedDescriptionKey:"Output exists: "+out.path])}
  let job=AVAssetExportSession(asset:asset,presetName:preset)!
  job.outputFileType = .mp4;job.outputURL=out;job.shouldOptimizeForNetworkUse=true
  let sem=DispatchSemaphore(value:0);job.exportAsynchronously{sem.signal()};sem.wait()
  guard job.status == .completed else {throw job.error!}
  print(out.path)
}
try export(mix,AVAssetExportPresetPassthrough,"isaac-promo-v2-master.mp4")
