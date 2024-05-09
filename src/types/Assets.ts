import { acceptableImages } from "../extensions/ImageMapper";

export interface AMM {
    location: "uni" | "behodler"
    type: "base" | "LP" | "pyro",
    url: string
}


export interface AssetProps {
    address: string,
    image: acceptableImages,
    friendlyName: string,
    AMMs?: AMM[]
}

export type Assets = {
    [key: string]: AssetProps[];
};