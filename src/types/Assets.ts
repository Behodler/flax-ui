import { acceptableImages } from "../extensions/ImageMapper";

export type TokenCategory = 'Behodler' | 'BlueChip' | 'LP' |'PyroToken'



export interface AMM {
    location: "uni" | "behodler"
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