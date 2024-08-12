import imageMap from "../constants/imageMap.json"
export type acceptableImages = 'eye'|'scx'|'scxEye'|'pyroScxEth'|'flax'|'scxEth'|'pyroScxEye'|'shiba'|'uni'|'shipaswap'|'uniPriceTilt'|'ethPriceTilt'|'shibPriceTilt'
export function getImagePath(name:acceptableImages)
{
    return imageMap[name]
}