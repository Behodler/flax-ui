import { acceptableImages } from "../extensions/ImageMapper";

export type TokenCategory = 'Behodler' | 'BlueChip' | 'LP' |'PyroToken'|'Meme'



export interface AMM {
    location: "uni" | "behodler"|'shiba'
    type: "base" | "LP" | "pyro",
    url: string
}


export interface AssetProps {
    address: string,
    image: acceptableImages,
    friendlyName: string,
    category:TokenCategory
    AMMs?: AMM[]
}

export type Assets = {
    [key: string]: AssetProps[];
};