import imageMap from "../images/imageMap.json"
export type acceptableImages = 'eye'|'scx'|'scxEye'|'pyroScxEth'|'flax'
export function getImagePath(name:acceptableImages)
 {
    return imageMap[name]
}