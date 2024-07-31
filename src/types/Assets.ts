import { acceptableImages } from "../extensions/ImageMapper";

export type TokenCategory = 'Behodler' | 'Blue Chip'

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