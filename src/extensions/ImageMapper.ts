import imageMap from "../constants/imageMap.json"
export type acceptableImages = 'eye'|'scx'|'scxEye'|'pyroScxEth'|'flax'|'scxEth'|'pyroScxEye'
export function getImagePath(name:acceptableImages)
{
    return imageMap[name]
}